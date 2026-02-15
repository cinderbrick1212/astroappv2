export const config = {
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  },
  strapi: {
    apiUrl: process.env.STRAPI_API_URL || 'http://localhost:1337/api',
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
  },
  env: process.env.EXPO_PUBLIC_ENV || 'development',
};
