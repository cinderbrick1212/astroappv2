import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let firebaseApp;

export const initializeFirebase = () => {
  if (getApps().length === 0) {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    const nodeEnv = process.env.NODE_ENV || 'development';
    
    if (serviceAccountKey) {
      try {
        const serviceAccount = JSON.parse(serviceAccountKey);
        firebaseApp = initializeApp({
          credential: cert(serviceAccount),
        });
        console.log('Firebase Admin SDK initialized with service account credentials');
      } catch (error) {
        console.error('Error parsing Firebase service account:', error);
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
      console.warn(
        'FIREBASE_SERVICE_ACCOUNT_KEY not set. Running in development mode without Firebase authentication. ' +
        'Set FIREBASE_SERVICE_ACCOUNT_KEY to enable Firebase auth.'
      );
      firebaseApp = initializeApp();
    }
  }
  return firebaseApp;
};

export const verifyFirebaseToken = async (idToken: string) => {
  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    throw new Error('Invalid Firebase token');
  }
};

export const getFirebaseAuth = () => {
  return getAuth();
};
