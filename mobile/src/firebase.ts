import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from './config';

export const app = initializeApp(config.firebase);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});
