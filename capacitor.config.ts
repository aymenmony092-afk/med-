import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dz.med.med_dz',
  appName: 'MED DZ',
  webDir: 'dist',
  server: {
    // The Android app loads the live MED DZ deployment so API requests keep
    // reaching the existing Express/Gemini backend without exposing secrets.
    url: 'https://med-dz.onrender.com',
    cleartext: false,
    allowNavigation: ['med-dz.onrender.com'],
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
