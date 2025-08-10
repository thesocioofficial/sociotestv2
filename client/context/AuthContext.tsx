"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Session, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const ALLOWED_DOMAIN = "christuniversity.in"; // Keep for client-side checks if needed

type UserData = {
  id: number;
  created_at: string;
  name: string;
  register_number: number | null;
  email: string;
  course: string | null;
  department: string | null;
  badges: any;
  campus: string | null;
  is_organiser: boolean;
  avatar_url: string | null;
};

type AuthContextType = {
  session: Session | null;
  userData: UserData | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();
  const router = useRouter();

  const isEmailAllowed = (email: string | undefined): boolean => {
    return !!email && email.endsWith(ALLOWED_DOMAIN);
  };

  useEffect(() => {
    const checkUserSession = async () => {
      setIsLoading(true);
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (currentSession) {
          if (isEmailAllowed(currentSession.user?.email)) {
            setSession(currentSession);
            await fetchUserData(currentSession.user.email!);
          } else {
            await supabase.auth.signOut();
            setSession(null);
            setUserData(null);
          }
        }
      } catch (error) {
        console.error("Error checking user session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setIsLoading(true);
      if (event === "SIGNED_IN" && newSession) {
        if (isEmailAllowed(newSession.user?.email)) {
          setSession(newSession);

          await createOrUpdateUser(newSession.user);
          await fetchUserData(newSession.user.email!);
        } else {
          console.warn(
            "SIGNED_IN event with non-allowed domain on client. Signing out."
          );
          await supabase.auth.signOut();
          setSession(null);
          setUserData(null);
          router.push("/error?reason=client_domain_mismatch");
        }
      } else if (event === "SIGNED_OUT") {
        setSession(null);
        setUserData(null);
      } else if (event === "USER_UPDATED" && newSession) {
        if (isEmailAllowed(newSession.user?.email)) {
          setSession(newSession);
          await fetchUserData(newSession.user.email!);
        }
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const createOrUpdateUser = async (user: User) => {
    if (!user?.email || !isEmailAllowed(user.email)) return;

    try {
      const payload = {
        id: user.id,
        email: user.email,
        name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0],
        avatar_url: user.user_metadata?.avatar_url,
        is_organiser: user.email?.endsWith("@christuniversity.in"),
      };

      const response = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: payload }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create/update user: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error creating/updating user:", error);
    }
  };

  const fetchUserData = async (email: string) => {
    if (!email || !isEmailAllowed(email)) {
      setUserData(null);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/${email}`);
      if (!response.ok) {
        if (response.status === 404) {
          console.warn(
            `User data not found for ${email}. User might need to be created.`
          );
          setUserData(null);
        } else {
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }
        return;
      }
      const data = await response.json();
      setUserData(data.user);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserData(null);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${APP_URL}/auth/callback`,
        },
      });
    } catch (error) {
      console.error("Google authentication error:", error);
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
    }
  };

  return (
    <AuthContext.Provider
      value={{ session, userData, isLoading, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
