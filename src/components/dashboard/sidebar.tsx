
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  Bot,
  LayoutDashboard,
  LogOut,
  Pill,
  Siren,
  User,
  Video,
} from 'lucide-react';
import { signOut } from 'firebase/auth';

import { Logo } from '@/components/logo';
import { useFirebase } from '@/firebase';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useUser } from '@/firebase/provider';
import { SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarContent, useSidebar } from '../ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const sidebarNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'AI Chatbot',
    href: '/dashboard/chatbot',
    icon: Bot,
  },
  {
    title: 'Teleconsultation',
    href: '/dashboard/teleconsultation',
    icon: Video,
  },
  {
    title: 'Prescriptions',
    href: '/dashboard/prescriptions',
    icon: Pill,
  },
  {
    title: 'Health Trends',
    href: '/dashboard/trends',
    icon: BarChart3,
  },
  {
    title: 'Smart Alerts',
    href: '/dashboard/alerts',
    icon: Siren,
  },
];

interface DashboardSidebarProps {
    isMobile?: boolean;
    onLinkClick?: () => void;
}

export function DashboardSidebar({ isMobile = false, onLinkClick }: DashboardSidebarProps) {
  const { user, userData } = useUser();
  const router = useRouter();
  const { auth } = useFirebase();
  const pathname = usePathname();
  const { open } = useSidebar();
  const isCollapsed = !open && !isMobile;

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/');
  };

  return (
    <>
      <SidebarHeader className='p-4 border-b border-white/10'>
        <div className="flex items-center justify-center">
            <Logo showText={!isCollapsed} />
        </div>
      </SidebarHeader>

      <SidebarContent className='p-2'>
        <SidebarMenu>
          {sidebarNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={isCollapsed ? item.title : undefined}
                  onClick={onLinkClick}
                >
                  <item.icon className="h-5 w-5" />
                  <span className={cn(isCollapsed && "hidden")}>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className='p-2 border-t border-white/10'>
          <DropdownMenu>
            <DropdownMenuTrigger className='outline-none'>
              <div className={cn("p-2 flex items-center gap-3 rounded-md hover:bg-sidebar-accent", isCollapsed && "justify-center")}>
                  <Avatar className='h-9 w-9'>
                      <AvatarImage src={userData?.photoURL || user?.photoURL || undefined} />
                      <AvatarFallback>
                          {userData?.displayName?.charAt(0).toUpperCase() || user?.displayName?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                  </Avatar>
                  <div className={cn("text-left", isCollapsed && "hidden")}>
                      <p className="font-semibold text-sm text-foreground truncate">{userData?.displayName || user?.displayName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side={isMobile ? "bottom" : "right"} align="start" className='w-56'>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
               <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </SidebarFooter>
    </>
  )
}
