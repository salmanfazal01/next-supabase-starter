"use client";

import { fetchProfile } from "@/lib/api/client/profiles";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database/profile";
import type { User } from "@supabase/supabase-js";
import type React from "react";
import { useEffect, useState } from "react";
import { createContext, useContextSelector } from "use-context-selector";

interface AuthContextType {
  mounted: boolean;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser: User | null;
  initialProfile: Profile | null;
}

export function AuthProvider({
  children,
  initialUser,
  initialProfile,
}: AuthProviderProps) {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(initialUser);
  const [profile, setProfile] = useState<Profile | null>(initialProfile);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    try {
      const data = await fetchProfile(user.id);

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (process.env.NODE_ENV === "development") {
        console.log("Auth state change:", event);
      }

      setUser(session?.user ?? null);

      if (session?.user) {
        // Fetch profile when user signs in
        const data = await fetchProfile(session.user.id);

        if (data) {
          setProfile(data);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        mounted,
        user,
        profile,
        loading,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth<T>(selector: (state: AuthContextType) => T): T {
  return useContextSelector(AuthContext, (context) => {
    if (context === undefined) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return selector(context);
  });
}
