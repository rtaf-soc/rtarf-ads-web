// https://nuxt.com/docs/api/configuration/nuxt-config
import materialIcons from 'quasar/icon-set/svg-material-icons'
import materialIconsRound from 'quasar/icon-set/svg-material-icons-round'


export default defineNuxtConfig({
  app:{
    head:{
      title:'Military Rule Detection Joint Sharing',
      link:[
        {rel:'icon',type:'image/x-icon',href:'favicon.ico'}
      ]
    }
  },
  plugins: [
    '~/plugins/websocket.js',
  
  ],

  devtools: { enabled: true },

  modules: [
    '@nuxt/devtools',
    'nuxt-quasar-ui',
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
    // '@nuxtjs/axios',
    // '@nuxtjs/auth-next'
    // '@nuxtjs/dotenv'
  ],

  // router: {
  //   middleware: 'auth'
  // },

  googleFonts: {
    families: {
      // Specify the font and its styles
      'Noto+Sans+Thai': [100, 300, 400, 500, 700, 900],
    },
    display: 'swap', // Optional: Use 'swap' to enable font-display: swap
  },

  runtimeConfig: {
    public: {
      baseURL: process.env.NUXT_PUBLIC_API_BASE || 'https://api.example.com/',
      scaleURL: process.env.NUXT_PUBLIC_API_SCALE || 'https://api.example.com/',
      // timeout: process.env.NUXT_API_TIMEOUT || 5000,
    },
  },

  css: [
    // ...
    // 'quasar/fonts',
    // Reference the global CSS file
    './assets/global.css',
    'quasar/animations',
    'quasar/icons',
    'quasar/css',
    // 'quasar/brand', // If config.brand is used
    // ...
  ],

  quasar: {

    sassVariables: 'assets/quasar-variables.sass',
    plugins: [
      'AppFullscreen',
      'BottomSheet',
      'Dialog',
      'Loading',
      'LoadingBar',
      'Notify',
    ],
    iconSet: {
      ...materialIcons,
      colorPicker: materialIconsRound.colorPicker,
    },
    extras: {
      // font: 'roboto-font',
      fontIcons: ['material-icons'],
      animations: 'all',
    },
    config: {
      dark: true,
    },
    components: {
      defaults: {
        QBtn: {
          glossy: false,
        },
      },
    },
  },

  compatibilityDate: '2024-09-04',
})