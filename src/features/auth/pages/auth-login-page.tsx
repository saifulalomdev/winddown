import { GoogleSignIn } from '@capawesome/capacitor-google-sign-in';
import { LanguageSwitcher } from "@/components/language-switcher";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/icon/google-icon";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { authClient } from '../auth-client';
import { useAuth } from '../components/auth-context';
import { fetchFreshAuthData } from '../auth-utils';

export function AuthLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation('auth');
  const { setAuthData } = useAuth();
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

      if (!result || !result.idToken) {
        alert("Native Google SignIn succeeded but returned an empty ID token profile!");
        return;
      }
      
      // 1. Authenticate with server
      await authClient.signIn.social({
        provider: "google",
        idToken: { token: result.idToken }
      });

      // 2. Fetch full session + orgs together
      const freshData = await fetchFreshAuthData();

      if (freshData) {
        setAuthData(freshData);
        navigate("/", { replace: true });
      } else {
        alert("Failed to restore session after login.");
      }
    } catch (error: any) {
      alert(`APK Error Profile:\nCode: ${error.code}\nMessage: ${error.message || JSON.stringify(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col justify-between h-dvh py-10 px-6">
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