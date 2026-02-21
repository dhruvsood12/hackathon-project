'use client';

import { useEffect, useState } from 'react';

export interface Session {
  userId: string;
  email: string;
}

const SESSION_KEY = 'drive_ucsd_session';

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as Session;
  } catch {
    return null;
  }
}

export function setSession(userId: string, email: string): void {
  if (typeof window === 'undefined') return;

  const session: Session = { userId, email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}

export function useSession(): { session: Session | null; isLoaded: boolean } {
  const [session, setSessionState] = useState<Session | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setSessionState(getSession());
    setIsLoaded(true);
  }, []);

  return { session, isLoaded };
}

