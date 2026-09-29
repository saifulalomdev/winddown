import { ErrorCode, GoogleSignIn } from '@capawesome/capacitor-google-sign-in';
import { LanguageSwitcher } from "@/components/language-switcher";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/icon/google-icon";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { authClient } from '../auth-client';

export function AuthIndex() {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation('auth');
  const navigate = useNavigate();

  useEffect(() => {
    const initGoogleAuth = async () => {
      try {
        await GoogleSignIn.initialize({
          clientId: '754679532343-pi39b5nuskja8fpuoc120h75msdqqhm7.apps.googleusercontent.com',
          scopes: ['profile', 'email'],
        });
      } catch (e) {
        console.error("Initialization error:", e);
      }
    };
    initGoogleAuth();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await GoogleSignIn.signIn();
      await authClient.signIn.social({
        provider: "google",
        idToken: { token: result.idToken }
      });
      navigate("/")
    } catch (error: any) {
      if (error.code === ErrorCode.SignInCanceled) {
        console.log('The user canceled the sign-in flow.');
      } else if (error.code === ErrorCode.NoCredentialAvailable) {
        console.log('No Google account is available on this device.');
      } else if (error.code === ErrorCode.ProviderConfigurationError) {
        console.log('Google Play services is not available or not up to date.');
      } else {
        console.log('Another error occurred:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col justify-between h-dvh p-10">
      <AuthBranding />
      <div className="space-y-3 w-full">
        <LanguageSwitcher />
        <Button
          className="w-full gap-3"
          disabled={isLoading}
          onClick={handleGoogleSignIn}
        >
          <GoogleIcon />
          <span>{t('continueWithGoogle')}</span>
          {isLoading && <Spinner />}
        </Button>
      </div>
    </main>
  );
}

export function AuthBranding() {
  const { t } = useTranslation('auth');

  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-3">
      <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center shadow-sm">
        <span className="text-white text-3xl font-bold">EZ</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        {t('appName')}
      </h1>
    </div>
  );
}