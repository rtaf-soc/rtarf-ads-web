// https://nuxt.com/docs/api/configuration/nuxt-config
import materialIcons from "quasar/icon-set/svg-material-icons";
import materialIconsRound from "quasar/icon-set/svg-material-icons-round";

export default defineNuxtConfig({
  app: {
    head: {
      title: "Military Rule Detection Joint Sharing",
      link: [
        { rel: "icon", type: "image/svg+xml", href: "favicon.svg" },
        { rel: "icon", type: "image/x-icon", href: "favicon.ico" }

      ],
    },
  },
  plugins: ["~/plugins/websocket.js"],

  devtools: { enabled: true },

  modules: [
    "@nuxt/devtools",
    "nuxt-quasar-ui",
    "@nuxtjs/google-fonts",
    "@pinia/nuxt",
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
      "Noto+Sans+Thai": [100, 300, 400, 500, 700, 900],
    },
    display: "swap", // Optional: Use 'swap' to enable font-display: swap
  },

  runtimeConfig: {
    //for backend (secret)
    apiPath: "xx",
    keycloak: {
      idpEndpoint: "xx",
      idpClientId: "xx",
      idpClientSecret: "xx",
    },

    // tool:{
    //   url01:"https://www.google.co.th/1",
    //   url02:"https://www.google.co.th/2",
    //   url031:"https://www.google.co.th/31",
    //   url032:"https://www.google.co.th/32",
    //   url033:"https://www.google.co.th/33",
    //   url041:"https://www.google.co.th/41",
    //   url042:"https://www.google.co.th/42",
    //   url043:"https://www.google.co.th/43",
    //   url044:"https://www.google.co.th/44",
    //   url05:"https://www.google.co.th/5",
    //   url06:"https://www.google.co.th/6",
    //   url07:"https://www.google.co.th/7",
    //   url08:"https://www.google.co.th/8",
    // },
    // dashboard:{
    //   url01:"https://www.google.co.th/1",
    //   url02:"https://www.google.co.th/2",
    //   url03:"https://www.google.co.th/3",
    //   url04:"https://www.google.co.th/4",
    //   url05:"https://www.google.co.th/5",
    //   url06:"https://www.google.co.th/6",
    //   url07:"https://www.google.co.th/7",
    //   url08:"https://www.google.co.th/8",
    //   url09:"https://www.google.co.th/9",
    //   url10:"https://www.google.co.th/10",
    // },

    //for frontend (expose)
    public: {
      baseURL: "https://api.example.com",
      scaleURL: "https://api.example.com",
      geoIpURL: "https://www.google.co.th",
      machineStatusURL: "https://www.apple.com",
      dashboard:{
        url01:"https://www.google.co.th/1",
        url02:"https://www.google.co.th/2",
        url03:"https://www.google.co.th/3",
        url04:"https://www.google.co.th/4",
        url05:"https://www.google.co.th/5",
        url06:"https://www.google.co.th/6",
        url07:"https://www.google.co.th/7",
        url08:"https://www.google.co.th/8",
        url09:"https://www.google.co.th/9",
        url10:"https://www.google.co.th/10",
      },
      tool:{
        url01:"https://www.google.co.th/1",
        url02:"https://www.google.co.th/2",
        url031:"https://www.google.co.th/31",
        url032:"https://www.google.co.th/32",
        url033:"https://www.google.co.th/33",
        url041:"https://www.google.co.th/41",
        url042:"https://www.google.co.th/42",
        url043:"https://www.google.co.th/43",
        url044:"https://www.google.co.th/44",
        url05:"https://www.google.co.th/5",
        url06:"https://www.google.co.th/6",
        url07:"https://www.google.co.th/7",
        url08:"https://www.google.co.th/8",
      },

    },
  },

  css: [
    // ...
    // 'quasar/fonts',
    // Reference the global CSS file
    "./assets/global.css",
    "quasar/animations",
    "quasar/icons",
    "quasar/css",
    // 'quasar/brand', // If config.brand is used
    // ...
  ],

  quasar: {
    sassVariables: "assets/quasar-variables.sass",
    plugins: [
      "AppFullscreen",
      "BottomSheet",
      "Dialog",
      "Loading",
      "LoadingBar",
      "Notify",
    ],
    iconSet: {
      ...materialIcons,
      colorPicker: materialIconsRound.colorPicker,
    },
    extras: {
      // font: 'roboto-font',
      fontIcons: ["material-icons"],
      animations: "all",
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

  compatibilityDate: "2024-09-04",
});
