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
    // '@nuxtjs/axios',
    // '@nuxtjs/auth-next'
    // '@nuxtjs/dotenv'
    "@pinia/nuxt",
    "nuxt-monaco-editor",
  ],
  monaco: {
    // Optional: List additional languages you want to support
    languages: ['yaml', 'javascript', 'typescript']
  },

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
    debugMode:"false",

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
      commander:{
        url01:"https://www.google.co.th/commander"
      },
      monitoringWebUrl:"https://www.zabbix.com",
      
      // Add new environment variables for MITRE ATT&CK
      mitr: {
        url01: "https://attack.mitre.org"
      },
      
      // Add new environment variables for Cyber Kill Chain
      ckc: {
        url01: "https://www.google.co.th/reconnaissance",
        url02: "https://www.google.co.th/weaponization",
        url03: "https://www.google.co.th/delivery",
        url04: "https://www.google.co.th/exploitation",
        url05: "https://www.google.co.th/installation",
        url06: "https://www.google.co.th/command-control",
        url07: "https://www.google.co.th/actions-objectives"
      },
      
      // Add new environment variables for ASEAN Cyber Operations
      aco: {
        url01: "https://www.google.co.th/cambodia",
        url02: "https://www.google.co.th/myanmar",
        url03: "https://www.google.co.th/malaysia",
        url04: "https://www.google.co.th/laos",
        url05: "https://www.google.co.th/vietnam",
        url06: "https://www.google.co.th/chaina",
        url07: "https://www.google.co.th/north-korea",
      }
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