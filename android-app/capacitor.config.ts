import type { CapacitorConfig } from '@capacitor/cli';

// La app Android es una "ventana": carga la app publicada en GitHub Pages.
// Actualizar la app = publicar en Pages; el APK no cambia.
const config: CapacitorConfig = {
  appId: 'com.ownmanager.corte',
  appName: 'Own Manager',
  webDir: 'www',
  server: {
    url: 'https://mauriciopizano98-gif.github.io/ownmanager-app/',
    androidScheme: 'https',
    allowNavigation: [
      'asufiwzmhfnyomkzatqs.supabase.co',
      '*.supabase.co',
      'cdn.jsdelivr.net',
      'cdnjs.cloudflare.com',
      'fonts.googleapis.com',
      'fonts.gstatic.com',
    ],
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#0B0F14',
  },
};

export default config;
