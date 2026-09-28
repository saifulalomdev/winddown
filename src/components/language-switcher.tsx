// src/components/language-switcher.tsx
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation('auth');

  const changeLanguage = (lang: 'en' | 'bn') => {
    i18n.changeLanguage(lang);
  };

  const currentLang = i18n.language;
  const isEnglish = currentLang === 'en';
  const isBangla = currentLang === 'bn';

  return (
    <div className="flex flex-row items-center gap-2 h-12 justify-between w-full bg-gray-100 rounded-full">
      <Button
        size="sm"
        variant={isEnglish ? 'outline' : 'ghost'}
        className="flex-1"
        onClick={() => changeLanguage('en')}
      >
        {t('languageEnglish')}
      </Button>

      <Button
        size="sm"
        variant={isBangla ? 'outline' : 'ghost'}
        className="flex-1"
        onClick={() => changeLanguage('bn')}
      >
        {t('languageBangla')}
      </Button>
    </div>
  );
}