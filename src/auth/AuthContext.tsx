import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { auth } from '../firebase/config';

type AuthResult = { ok: true } | { ok: false; error: string };

type AuthContextValue = {
  user: User | null;
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOutUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResult>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function friendlyError(error: unknown): string {
  const code = (error as { code?: string })?.code ?? '';
  switch (code) {
    case 'auth/invalid-email':
      return 'That email address looks invalid.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      initializing,
      signIn: async (email, password) => {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          return { ok: true };
        } catch (error) {
          return { ok: false, error: friendlyError(error) };
        }
      },
      signUp: async (email, password) => {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          return { ok: true };
        } catch (error) {
          return { ok: false, error: friendlyError(error) };
        }
      },
      signOutUser: () => signOut(auth),
      resetPassword: async (email) => {
        try {
          await sendPasswordResetEmail(auth, email);
          return { ok: true };
        } catch (error) {
          return { ok: false, error: friendlyError(error) };
        }
      },
    }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
