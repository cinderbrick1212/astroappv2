import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let firebaseApp;

export const initializeFirebase = () => {
  const logger = (global as any).strapi?.log;
  if (getApps().length === 0) {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    const nodeEnv = process.env.NODE_ENV || 'development';
    
    if (serviceAccountKey) {
      try {
        const serviceAccount = JSON.parse(serviceAccountKey);
        firebaseApp = initializeApp({
          credential: cert(serviceAccount),
        });
        logger?.info('Firebase Admin SDK initialized with service account credentials');
      } catch (error) {
        logger?.error('Error parsing Firebase service account:', error);
        throw error;
      }
    } else if (nodeEnv === 'production') {
      // In production, Firebase credentials are required
      throw new Error(
        'FIREBASE_SERVICE_ACCOUNT_KEY environment variable is required in production. ' +
        'Please set this variable with your Firebase service account JSON.'
      );
    } else {
      // In development, allow running without Firebase for testing
      logger?.warn(
        'FIREBASE_SERVICE_ACCOUNT_KEY not set. Running in development mode without Firebase authentication. ' +
        'Set FIREBASE_SERVICE_ACCOUNT_KEY to enable Firebase auth.'
      );
      firebaseApp = initializeApp();
    }
  }
  return firebaseApp;
};

export const verifyFirebaseToken = async (idToken: string) => {
  const logger = (global as any).strapi?.log;
  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    logger?.error('Error verifying Firebase token:', error);
    throw error;
  }
};

export const getFirebaseAuth = () => {
  return getAuth();
};
