// src/lib/i18n.ts
import { initReactI18next } from 'react-i18next';
import { authEn, authBn } from '@/features/auth';
import i18n from 'i18next';

i18n.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    resources: {
        en: { auth: authEn },
        bn: { auth: authBn },
    },
    lng: 'bn',
    fallbackLng: 'bn',
    interpolation: {
        escapeValue: false,
    },
    react: {
        useSuspense: false
    },
});

export default i18n;