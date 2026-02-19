import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locales/en.json';
import hi from './locales/hi.json';
import { storage } from './utils/storage';

async function getStoredLanguage(): Promise<string> {
  try {
    const stored = await AsyncStorage.getItem(storage.keys.LANGUAGE_PREFERENCE);
    return stored ?? 'en';
  } catch {
    return 'en';
  }
}

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      hi: { translation: hi },
    },
    interpolation: {
      escapeValue: false,
    },
  });

// Restore persisted language after init
getStoredLanguage().then(lang => {
  if (lang !== i18n.language) {
    i18n.changeLanguage(lang);
  }
});

export default i18n;
