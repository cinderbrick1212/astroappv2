import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '../utils/storage';

export interface StrapiUser {
  id: number;
  username: string;
  email: string;
  isGuest?: boolean;
}

interface AuthContextType {
  user: StrapiUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (jwt: string, user: StrapiUser) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<StrapiUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const token = await storage.get<string>(storage.keys.AUTH_TOKEN);
        const userData = await storage.get<StrapiUser>(storage.keys.USER_DATA);
        const isRestoredGuest = userData?.isGuest === true && userData.id === -1 && !token;
        if (userData && (token || isRestoredGuest)) {
          setUser(userData);
        }
      } catch {
        // ignore storage errors
      } finally {
        setLoading(false);
      }
    };
    loadStoredAuth();
  }, []);

  const login = async (jwt: string, userData: StrapiUser) => {
    await storage.set(storage.keys.AUTH_TOKEN, jwt);
    await storage.set(storage.keys.USER_DATA, userData);
    setUser(userData);
  };

  const loginAsGuest = async () => {
    const guestUser: StrapiUser = { id: -1, username: 'Guest', email: '', isGuest: true };
    await storage.set(storage.keys.USER_DATA, guestUser);
    setUser(guestUser);
  };

  const signOut = async () => {
    await storage.remove(storage.keys.AUTH_TOKEN);
    await storage.remove(storage.keys.USER_DATA);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, loginAsGuest, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
