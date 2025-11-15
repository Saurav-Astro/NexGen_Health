'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass-card";
import { useUser } from "@/firebase/provider";
import { format } from "date-fns";
import { Edit, User, Mail, Calendar } from "lucide-react";

export default function ProfilePage() {
  const { user, userData } = useUser();

  const getInitials = (name: string | undefined | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const joinedDate = userData?.createdAt?.toDate();

  return (
    <div className="space-y-8">
       <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
          My Profile
        </h1>
        <p className="text-muted-foreground">
          View and manage your account details.
        </p>
      </header>

      <GlassCard className="p-8">
        <div className="flex flex-col items-center gap-8 md:flex-row">
            <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-primary/50">
                    <AvatarImage src={userData?.photoURL || user?.photoURL || undefined} alt={userData?.displayName || "User"} />
                    <AvatarFallback className="text-4xl">
                        {getInitials(userData?.displayName || user?.displayName)}
                    </AvatarFallback>
                </Avatar>
                <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit profile picture</span>
                </Button>
            </div>
            <div className="w-full space-y-4 text-center md:text-left">
                <div>
                    <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-2"><User className="h-4 w-4" /> Username</p>
                    <p className="text-2xl font-bold text-foreground">{userData?.displayName || user?.displayName}</p>
                </div>
                 <div>
                    <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-2"><Mail className="h-4 w-4" /> Email Address</p>
                    <p className="text-lg text-foreground">{user?.email}</p>
                </div>
                 <div>
                    <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-2"><Calendar className="h-4 w-4" /> Member Since</p>
                    <p className="text-lg text-foreground">
                        {joinedDate ? format(joinedDate, "MMMM dd, yyyy") : 'Not available'}
                    </p>
                </div>
            </div>
        </div>
      </GlassCard>
    </div>
  );
}
