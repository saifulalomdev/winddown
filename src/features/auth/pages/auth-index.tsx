// src/features/auth/pages/auth-index.tsx
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { GoogleIcon } from "@/icon/google-icon";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function AuthIndex() {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation('auth');

  const handleGoogleSignIn = () => {
    setIsLoading(true);
  };

  return (
    <div className="flex flex-col justify-between h-dvh overflow-hidden p-10">
      <AuthBranding />
      <div className="space-y-3 w-full">
        <LanguageSwitcher />
        <Button className="w-full gap-3" disabled={isLoading} onClick={handleGoogleSignIn}>
          <GoogleIcon />
          <span>{t('continueWithGoogle')}</span>
          {isLoading && <Spinner />}
        </Button>
      </div>
    </div>
  );
}

export function AuthBranding() {
  const { t } = useTranslation('auth');

  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-3">
      <div className="w-20 h-20 rounded-2xl bg-black flex items-center justify-center shadow-sm">
        <span className="text-white text-3xl font-bold">EZ</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        {t('appName')}
      </h1>
      <p className="text-sm text-muted-foreground text-center px-6">
        {t('appSubtitle')}
      </p>
    </div>
  );
}