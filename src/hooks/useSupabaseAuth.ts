
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

export function useSupabaseAuth(redirectUnauthenticated = false) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (redirectUnauthenticated && !session?.user) {
        navigate("/auth");
      }
    });

    // Fetch current session/user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (redirectUnauthenticated && !session?.user) {
        navigate("/auth");
      }
    });
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line
  }, []);

  // Logout handler
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { user, session, loading, signOut };
}
