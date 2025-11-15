
'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Bot, Loader2, Send, Sparkles, User, X } from 'lucide-react';
import { aiSymptomQuery } from '@/ai/flows/ai-symptom-query';
import { cn } from '@/lib/utils';
import offlineData from '@/lib/offline-chat-data.json';
import { useFirebase } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const formSchema = z.object({
  message: z.string().min(1),
});

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const initialMessage: Message = {
    role: 'assistant',
    content: "Hello! I'm your AI Health Assistant. I can answer questions about medical symptoms, conditions, and mental health. How can I help you today? \n\nPlease remember, I'm an AI assistant and not a substitute for professional medical advice."
}

export function AiChatPanel() {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { firestore, user } = useFirebase();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSubmitting]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const userMessage: Message = { role: 'user', content: values.message };
    setMessages((prev) => [...prev, userMessage]);
    setIsSubmitting(true);
    form.reset();

    try {
      const result = await aiSymptomQuery({ query: values.message });
      const assistantMessage: Message = { role: 'assistant', content: result.response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("AI Symptom Query Error:", error);
      
      // Save error to Firestore
      if (firestore) {
        try {
          await addDoc(collection(firestore, "errors"), {
            userId: user?.uid || 'anonymous',
            query: values.message,
            error: error.message || 'Unknown error',
            timestamp: serverTimestamp()
          });
        } catch (dbError) {
          console.error("Failed to log error to Firestore:", dbError);
        }
      }

      const userQuery = values.message.toLowerCase().trim();
      const offlineResponse = offlineData.offlineResponses.find(
        (item) => item.question.toLowerCase() === userQuery
      );

      let errorMessage: Message;
      if (offlineResponse) {
        errorMessage = {
          role: 'assistant',
          content: offlineResponse.answer,
        };
      } else {
        errorMessage = {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        };
      }
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSubmitting(false);
    }
  }

  const clearChat = () => {
    setMessages([initialMessage]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto h-full flex flex-col p-0 glass-container">
      <div className="p-4 border-b border-white/10 flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-2">
          <Sparkles className="text-primary h-5 w-5" />
          <h2 className="text-foreground font-medium">AI Health Assistant</h2>
        </div>
        <button 
          onClick={clearChat}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${msg.role === 'user' ? "justify-end" : "justify-start"}`}
            >
               {msg.role === 'assistant' && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
                    <Bot className="h-5 w-5 text-primary" />
                </div>
               )}
              <div
                className={cn(`max-w-[80%] p-3 rounded-2xl animate-fade-in`,
                  msg.role === 'user'
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-background/50 rounded-tl-none"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
                {msg.role === 'user' && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center border border-border">
                    <User className="h-5 w-5 text-muted-foreground" />
                </div>
               )}
            </div>
          ))}
          {isSubmitting && (
            <div className="flex justify-start gap-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div className="max-w-[80%] p-3 rounded-2xl bg-background/50 rounded-tl-none">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-75"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <form 
        onSubmit={form.handleSubmit(onSubmit)}
        className="p-4 border-t border-white/10 shrink-0"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            {...form.register("message")}
            placeholder="Type your message..."
            autoComplete="off"
            className="w-full bg-background/50 border border-border rounded-full py-3 pl-4 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            type="submit"
            disabled={isSubmitting || !form.watch('message')}
            className={cn(`absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-2.5 transition-colors`,
              !form.watch('message') || isSubmitting
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "text-primary-foreground bg-primary hover:bg-primary/90"
            )}
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
      
      <style>
        {`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        .delay-75 {
          animation-delay: 0.2s;
        }
        
        .delay-150 {
          animation-delay: 0.4s;
        }
        `}
      </style>
    </div>
  );
}
