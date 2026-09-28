

# Comprehensive Frontend Guide: Google Sign-In with React, Vite, and Capacitor

### A Detailed Guide to Environment Binding, Cloud Credentials, Native Android Modification, and Remote DevTools Inspection

This guide details the complete frontend lifecycle required to fetch a Google `idToken` using **React**, **Vite**, and **Capacitor** with the Capawesome `@capawesome/capacitor-google-sign-in` plugin. It targets a physical Android device while leveraging a live-reloading dev environment over a local Wi-Fi network.
---
## 🛠️ Step 1: Environment & LAN Binding

To test your application on a physical phone with live reloading, you must make sure your development machine and your phone are on the exact same Wi-Fi network.

### 1. Dynamically Exposing Your Host Machine's Local IP via ViteHardcoding your local IP in configurations causes broken links when your router reassigns your IP addresses. To dynamically expose your real computer IP address over your local network, adjust your `vite.config.ts` configuration to open the host boundary:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listens on all local IP addresses (0.0.0.0) exposing your server to the local network
    port: 4000, // Forces the front-end dev port target
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```
*After running `npm run dev`, look at your terminal console logs under the **Network:** row header to find your computer's exact active local network IP address (e.g., `http://192.168.0.101:4000`).*

### 2. Binding Live Reload in `capacitor.config.ts`
Instruct the native Capacitor runtime container layer to fetch your app shell assets live from the Vite network server target instead of pointing to static output build folders:
```typescript
// capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.saifulalom.ezorder', // Must match your native package string exactly
  appName: 'EZ Order',
  webDir: 'dist',
};

export default config;
```
---

## 🔑 Step 2: Google Cloud Console Configuration
Native OAuth workflows depend on linking separate cross-platform Google endpoints within the same application console space. 

### 1. Generating the Web Client ID This identification string handles the primary JavaScript authorization layer inside your React initialization hooks.

* Open the [Google Cloud Console Credentials Hub](https://google.com).* Select **Create Credentials** > **OAuth client ID** > **Web application**.* Under **Authorized JavaScript Origins**, add both development scopes:
  * `http://localhost:4000`
  * `http://192.168.0.101:4000` *(Matches your live reload network address)*
* Save and copy the resulting string wrapper (looks like `://googleusercontent.com`).

### 2. Generating the Android Client ID. This structural entity verifies your physical app build's authenticity using its cryptographic signature layout.
* Select **Create Credentials** > **OAuth client ID** > **Android**.

* **Package Name:** Input your native ID string exactly: `com.saifulalom.ezorder`
* **SHA-1 Certificate Fingerprint:** Open your project root directory and trace your debug key profile via terminal:

  ```bash
  npx add android
  cd android && ./gradlew signingReport
  ```
  Locate the log block marked `Variant: debug`, extract the long colon-separated **SHA-1** hex string value, and paste it directly into the dashboard console input box.
---
## 🤖 Step 3: Modifying Native Android Files
The Capawesome plugin requires you to register the **Web Client ID string** directly within the native app resource layer so the underlying Android Google Play Services SDK can access it.
### 1. Add the Android Platform TargetIf you haven't initialized your Android native source files within the project root directory, assemble the native build ecosystem explicitly:```bash
npx cap add android
```

### 2. Injecting Client Identification into `strings.xml`* Open your project files and locate the native XML value profile path:
  `android/app/src/main/res/values/strings.xml`
* Add a new entry element named `google_web_client_id` inside the `<resources>` block containing your **Web Client ID** value string:
```xml
<?xml version='1.0' encoding='utf-8'?>
<resources>
    <string name="app_name">EZ Order</string>
    <string name="title_activity_main">EZ Order</string>
    <string name="package_name">com.saifulalom.ezorder</string>
    <string name="custom_url_scheme">com.saifulalom.ezorder</string>
    
    <!-- FIXED: Inject your Google Web Client ID parameter here -->
    <string name="google_web_client_id">://googleusercontent.com</string>
</resources>
```
---
## 💻 Step 4: React Source Implementation (`AuthIndex.tsx`)

This component details how to initialize the `@capawesome/capacitor-google-sign-in` plugin within your React lifecycle hooks and capture a valid identity token (`idToken`) without backend dependencies.
```tsx
// src/pages/AuthIndex.tsx
import { ErrorCode, GoogleSignIn } from '@capawesome/capacitor-google-sign-in';
import { useState, useEffect } from "react";

export function AuthIndex() {
  const [isLoading, setIsLoading] = useState(false);
  const [tokenResult, setTokenResult] = useState<string | null>(null);

  // 1. Initialize the Google Auth Plugin on component mount
  useEffect(() => {
    const initGoogleAuth = async () => {
      try {
        await GoogleSignIn.initialize({
          // CRITICAL: Always provide your Google WEB client ID here, NOT the Android ID
          clientId: '://googleusercontent.com',
          scopes: ['profile', 'email'],
        });
        console.log("Google Sign-In plugin initialized successfully.");
      } catch (e) {
        console.error("Google Sign-In initialization exception:", e);
      }
    };
    initGoogleAuth();
  }, []);

  // 2. Trigger the Google Account Sheet layout selection flow
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setTokenResult(null);

      // Fires the native overlay dialog selector on your physical phone UI
      const result = await GoogleSignIn.signIn();

      // 3. Extract and manage the identity signature token
      if (!result.idToken) {
        throw new Error("No identity idToken string returned from Google Play Services SDK.");
      }

      console.log("SUCCESS! Extracted raw idToken value:", result.idToken);
      setTokenResult(result.idToken);

      // You now have the raw idToken! You can console.log or bind it to any storage variable here.
      
    } catch (error: any) {
      if (error.code === ErrorCode.SignInCanceled) {
        console.log('User closed the login modal sheet manually.');
      } else if (error.code === ErrorCode.NoCredentialAvailable) {
        console.log('No Google active account profiles found on this phone device.');
      } else if (error.code === ErrorCode.ProviderConfigurationError) {
        console.log('Google Play services setup verification failed or requires manual update.');
      } else {
        console.error('An unexpected runtime exception was thrown:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>EZ Order Login</h1>
      
      <button disabled={isLoading} onClick={handleGoogleSignIn}>
        {isLoading ? 'Connecting...' : 'Continue with Google'}
      </button>

      {tokenResult && (
        <div style={{ marginTop: '2rem', wordBreak: 'break-all', textAlign: 'left' }}>
          <h3>Extracted Google idToken:</h3>
          <code style={{ background: '#f4f4f4', padding: '10px', display: 'block' }}>{tokenResult}</code>
        </div>
      )}
    </div>
  );
}
```
---## 📱 Step 5: Native Device Debugging & Remote Inspection
To execute native mobile actions, you must run the application shell inside your physical phone container while inspecting the console logs on your desktop browser.
### 1. Compile and Launch the Application Bundle* Plug your physical phone device into your development machine via a USB connection cable.* Ensure **USB Debugging** is toggled active inside your device's **Developer Options** submenu list.* Push your structural framework update builds and execute on your target platform:
  ```bash
  npx cap sync android
  npx cap run android
  ```* Select your connected hardware device phone from the CLI terminal selection list prompts.

### 2. Inspecting via Chrome DevTools (`chrome://inspect`)* Open a new tab layout instance in your desktop Chrome browser and direct the URL search path to:
  ```text
  chrome://inspect/#devices
  ```
* Under the **Devices** window frame, find your physical telephone model signature (e.g., `RMX3201`). Underneath it, look for your active application project package entry link: `WebView in com.saifulalom.ezorder`.
### 3. Avoiding Screen Freezes via "Inspect Fallback"If your phone's systemic engine layout version differs from your host desktop browser's framework version, Chrome will output a red warning tag: 

Remote browser is newer than client browser. Try 'inspect fallback' if inspection fails.


* Do not click the default inspect label.
* Click the small blue inspect fallback link placed directly alongside the navigation options text strings.
* This loads a compatible, fully functional window workspace interface where you can see your real-time network states and inspect token returns when tapping buttons on your phone.

<FollowUp>
If you want, tell me:
* If you run into any **Developer Error Code numbers** (e.g., Code 10) inside your new fallback dev tools interface.

I can help verify your SHA-1 key alignments if needed.
</FollowUp>


