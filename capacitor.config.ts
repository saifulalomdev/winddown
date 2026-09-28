import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.winddown.app',
  appName: 'winddown',
  webDir: 'dist',
  server: {
    url: "http://192.168.0.101:4000",
    cleartext: true
  }
};

export default config;
