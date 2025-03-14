import { NuxtModule, RuntimeConfig } from '@nuxt/schema'
declare module '@nuxt/schema' {
  interface NuxtConfig {
    ["devtools"]?: typeof import("@nuxt/devtools").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>,    ["quasar"]?: typeof import("nuxt-quasar-ui").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>,    ["googleFonts"]?: typeof import("@nuxtjs/google-fonts").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>,    ["pinia"]?: typeof import("@pinia/nuxt").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>,    ["telemetry"]?: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>,  modules?: (undefined | null | false | NuxtModule | string | [NuxtModule | string, Record<string, any>] | ["@nuxt/devtools", Exclude<NuxtConfig["devtools"], boolean>] | ["nuxt-quasar-ui", Exclude<NuxtConfig["quasar"], boolean>] | ["@nuxtjs/google-fonts", Exclude<NuxtConfig["googleFonts"], boolean>] | ["@pinia/nuxt", Exclude<NuxtConfig["pinia"], boolean>] | ["@nuxt/telemetry", Exclude<NuxtConfig["telemetry"], boolean>])[],
  }
}
declare module 'nuxt/schema' {
  interface NuxtConfig {
    ["devtools"]?: typeof import("@nuxt/devtools").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>,    ["quasar"]?: typeof import("nuxt-quasar-ui").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>,    ["googleFonts"]?: typeof import("@nuxtjs/google-fonts").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>,    ["pinia"]?: typeof import("@pinia/nuxt").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>,    ["telemetry"]?: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>,  modules?: (undefined | null | false | NuxtModule | string | [NuxtModule | string, Record<string, any>] | ["@nuxt/devtools", Exclude<NuxtConfig["devtools"], boolean>] | ["nuxt-quasar-ui", Exclude<NuxtConfig["quasar"], boolean>] | ["@nuxtjs/google-fonts", Exclude<NuxtConfig["googleFonts"], boolean>] | ["@pinia/nuxt", Exclude<NuxtConfig["pinia"], boolean>] | ["@nuxt/telemetry", Exclude<NuxtConfig["telemetry"], boolean>])[],
  }
  interface RuntimeConfig {
   app: {
      buildId: string,

      baseURL: string,

      buildAssetsDir: string,

      cdnURL: string,
   },

   apiPath: string,

   keycloak: {
      idpEndpoint: string,

      idpClientId: string,

      idpClientSecret: string,
   },

   nitro: {
      envPrefix: string,
   },
  }
  interface PublicRuntimeConfig {
   baseURL: string,

   scaleURL: string,

   geoIpURL: string,

   machineStatusURL: string,
  }
}
declare module 'vue' {
        interface ComponentCustomProperties {
          $config: RuntimeConfig
        }
      }