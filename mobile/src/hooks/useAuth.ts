import { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase';
import { storage } from '../utils/storage';

export const useAuth = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Store auth token
        const token = await firebaseUser.getIdToken();
        await storage.set(storage.keys.AUTH_TOKEN, token);
      } else {
        await storage.remove(storage.keys.AUTH_TOKEN);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading, isAuthenticated: !!user };
};
