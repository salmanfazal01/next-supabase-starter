"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth as useAuthContext } from "@/context/auth-context";
import { useAuth } from "@/hooks/supabase/use-auth";
import { LogOut, User } from "lucide-react";
import Link from "next/link";

const AuthButtons = () => {
  const profile = useAuthContext((state) => state.profile);
  const { signOut } = useAuth();

  if (profile?.id) {
    const menuItems = [
      {
        href: "/dashboard",
        icon: User,
        label: "Dashboard",
        action: null,
      },
      {
        href: null,
        icon: LogOut,
        label: "Logout",
        action: () => signOut(),
      },
    ];

    // Profile Avatar
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative size-10 rounded-full">
            <Avatar className="size-10">
              <AvatarImage src={profile?.avatar_url} alt={profile?.username} />
              <AvatarFallback>
                {profile?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end" forceMount>
          {menuItems.map((item) => {
            const Icon = item.icon;

            const content = (
              <span className="flex items-center gap-2" key={item.label}>
                <Icon className="h-4 w-4" />

                {item.label}
              </span>
            );

            return item.href ? (
              <DropdownMenuItem key={item.label} asChild>
                <Link href={item.href}>{content}</Link>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem key={item.label} onClick={item.action!}>
                {content}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Link href="/auth/login">
      <Button size="sm">Login</Button>
    </Link>
  );
};

export default AuthButtons;
