// src/lib/i18n.ts
import { initReactI18next } from 'react-i18next';
import { authEn, authBn } from '@/features/auth';
import { Storage } from '@/utils/storage-helper'; 
import i18n from 'i18next';

const LANGUAGE_KEY = 'user_language';
const DEFAULT_LANGUAGE = 'en';

export const initI18n = async () => {
  // Get saved language from storage (fallback to 'en')
  const savedLanguage = await Storage.get<string>(LANGUAGE_KEY);
  const initialLng = savedLanguage || DEFAULT_LANGUAGE;

  await i18n.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    resources: {
      en: { auth: authEn },
      bn: { auth: authBn },
    },
    lng: initialLng,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

  return i18n;
};

// Automatically save the language whenever it changes
i18n.on('languageChanged', (lng) => {
  Storage.set(LANGUAGE_KEY, lng).catch((error) => {
    console.error('Failed to save language setting:', error);
  });
});

export default i18n;