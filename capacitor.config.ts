import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.saifulalom.ezorder',
  appName: 'EZ Order',
  webDir: 'dist',
  plugins: {
    App: {
      disableBackButtonHandler: true,
    },
  }
};

export default config;
