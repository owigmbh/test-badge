import { CapacitorConfig } from '@capacitor/cli';

let srv = {
  cleartext: true
};

if(process.env.APP_SOURCE != 'local') {
  if (process.env.NODE_ENV == 'production') {
    srv['url'] = process.env.DEVICE != 'ios' ? 'https://mycare-server.owitech.ch/app/index.html' : 'https://mycare-server.owitech.ch/app-ios/index.html';
  } else {
    srv['url'] = process.env.DEVICE != 'ios' ? 'http://mycare-demo.owitec.ch:18085/app/index.html' : 'http://mycare-demo.owitec.ch:18085/app-ios/index.html';
  }
}

const config: CapacitorConfig = {
  appId: 'ch.owitec.dentalink.app',
  appName: 'DentaLink',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#488AFF',
      sound: 'beep.wav'
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    Keyboard: {
      resize: "body",
      style: "dark",
      resizeOnFullScreen: true,
    },
    Badge: {
      persist: true,
      autoClear: false
    }
  },
  android: {
    allowMixedContent: true,
    webContentsDebuggingEnabled: true,
  },
  server: srv
};

export default config;
