import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'quantum-calculator',
  webDir: 'www',
  cordova: {
    preferences: {
      ScrollEnabled: 'false',
      'android-minSdkVersion': '22',
      BackupWebStorage: 'none',
      DisallowOverscroll: 'true',
      Orientation: 'portrait'
    }
  }
};

export default config;
