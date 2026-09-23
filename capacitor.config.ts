/// <reference types="node" />

import type { CapacitorConfig } from '@capacitor/cli';

const devServerUrl = process.env.CAPACITOR_DEV_SERVER_URL;

const config: CapacitorConfig = {
  appId: 'com.windown.app',
  appName: 'windown',
  webDir: 'dist',

  ...(devServerUrl && {
    server: {
      url: devServerUrl,
      cleartext: true,
    },
  }),
};

export default config;