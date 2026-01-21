"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'

// Extend the Session type to include profile information
interface CustomSession extends Session {
  user: Session['user'] & {
    profile?: {
      role?: string;
      username?: string;
      avatar_url?: string;
    };
  };
}

interface SessionContextType {
  session: CustomSession | null;
  loading: boolean;
  sessionReady: boolean;
}

const SessionContext = createContext<SessionContextType | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<CustomSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessionReady, setSessionReady] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      if (initialSession) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role, username, avatar_url')
          .eq('id', initialSession.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        }

        const customSession: CustomSession = {
          ...initialSession,
          user: {
            ...initialSession.user,
            profile: profile || undefined,
          },
        };
        setSession(customSession);
      } else {
        setSession(null);
      }
      setLoading(false);
      setSessionReady(true);
    };

    fetchSessionAndProfile(); // Fetch on initial load

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_, newSession) => {
      if (newSession) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role, username, avatar_url')
          .eq('id', newSession.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile on auth state change:', error);
        }

        const customSession: CustomSession = {
          ...newSession,
          user: {
            ...newSession.user,
            profile: profile || undefined,
          },
        };
        setSession(customSession);
      } else {
        setSession(null);
      }
      setLoading(false);
      setSessionReady(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <SessionContext.Provider value={{ session, loading, sessionReady }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === null) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
