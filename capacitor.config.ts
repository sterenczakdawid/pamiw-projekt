import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'pamiw-projekt',
  webDir: 'dist/pamiw_projekt/browser',
  server: {
    androidScheme: 'https',
  },
};

export default config;
