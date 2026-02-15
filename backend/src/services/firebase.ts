import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let firebaseApp;

export const initializeFirebase = () => {
  if (getApps().length === 0) {
    // For development, Firebase Admin SDK can use Application Default Credentials
    // or you can provide a service account key via FIREBASE_SERVICE_ACCOUNT_KEY env var
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (serviceAccountKey) {
      try {
        const serviceAccount = JSON.parse(serviceAccountKey);
        firebaseApp = initializeApp({
          credential: cert(serviceAccount),
        });
      } catch (error) {
        console.error('Error parsing Firebase service account:', error);
        throw error;
      }
    } else {
      // Use default credentials or empty initialization for development
      // This allows the app to run without Firebase in local development
      console.warn('FIREBASE_SERVICE_ACCOUNT_KEY not set. Firebase auth will not work.');
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
