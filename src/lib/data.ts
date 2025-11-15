import { BarChart3, Bot, Cloud, HandCoins, Stethoscope, Video } from "lucide-react";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
  { href: "/contact", label: "Contact" },
];

export const features = [
  {
    icon: Bot,
    title: "AI Chatbot",
    description: "Conversational assistant for symptom logging and instant health-related queries.",
    link: "/features#ai-chatbot",
  },
  {
    icon: HandCoins,
    title: "Prescription Tracker",
    description: "Logs medicines, schedules reminders, monitors adherence.",
    link: "/features#prescription-tracker",
  },
  {
    icon: BarChart3,
    title: "Health Trends",
    description: "Uses machine learning to detect anomalies and long-term health patterns.",
    link: "/features#health-trends",
  },
  {
    icon: Video,
    title: "Agora AI Teleconsultation",
    description: "Enables teleconsultation, voice input, and emotional-sentiment understanding.",
    link: "/features#agora-ai",
  },
  {
    icon: Stethoscope,
    title: "Smart Alerts",
    description: "Proactive notifications to users and doctors based on risk signals.",
    link: "/features#smart-alerts",
  },
  {
    icon: Cloud,
    title: "Cloud Sync",
    description: "Real-time secure synchronization of all health data across devices.",
    link: "/features#cloud-sync",
  },
];

export const testimonials = [
  {
    quote: "NexGen Health has revolutionized how I manage my chronic condition. The AI insights are a game-changer.",
    name: "Sarah J.",
    title: "Patient",
  },
  {
    quote: "As a physician, I can monitor my patients more effectively with the smart alerts and synchronized data. It's the future of healthcare.",
    name: "Dr. Michael Chen",
    title: "Cardiologist",
  },
  {
    quote: "The prescription tracker is so simple yet powerful. I never miss a dose anymore, and my health has visibly improved.",
    name: "David R.",
    title: "User",
  },
    {
    quote: "Finally, a health app that feels like it was designed in this century. The interface is beautiful and intuitive.",
    name: "Emily W.",
    title: "Tech Reviewer",
  },
];

export const footerLinks = {
  platform: [
    { href: "/features", label: "Features" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/login", label: "Login" },
    { href: "/signup", label: "Sign Up" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "#", label: "Careers" },
    { href: "#", label: "Press" },
  ],
  legal: [
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
    { href: "#", label: "Cookie Policy" },
  ],
};
