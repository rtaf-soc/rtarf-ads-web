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

    tool:{
      toolUrl01:"https://www.google.co.th/1",
      toolUrl02:"https://www.google.co.th/2",
      toolUrl031:"https://www.google.co.th/31",
      toolUrl032:"https://www.google.co.th/32",
      toolUrl033:"https://www.google.co.th/33",
      toolUrl041:"https://www.google.co.th/41",
      toolUrl042:"https://www.google.co.th/42",
      toolUrl043:"https://www.google.co.th/43",
      toolUrl044:"https://www.google.co.th/44",
      toolUrl05:"https://www.google.co.th/5",
      toolUrl06:"https://www.google.co.th/6",
      toolUrl07:"https://www.google.co.th/7",
      toolUrl08:"https://www.google.co.th/8",
    },
    dashboard:{
      dashboardUrl01:"https://www.google.co.th/1",
      dashboardUrl02:"https://www.google.co.th/2",
      dashboardUrl03:"https://www.google.co.th/3",
      dashboardUrl04:"https://www.google.co.th/4",
      dashboardUrl05:"https://www.google.co.th/5",
      dashboardUrl06:"https://www.google.co.th/6",
      dashboardUrl07:"https://www.google.co.th/7",
      dashboardUrl08:"https://www.google.co.th/8",
      dashboardUrl09:"https://www.google.co.th/9",
      dashboardUrl10:"https://www.google.co.th/10",
    },

    //for frontend (expose)
    public: {
      baseURL: "https://api.example.com",
      scaleURL: "https://api.example.com",
      geoIpURL: "https://www.google.co.th",
      machineStatusURL: "https://www.apple.com",

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
