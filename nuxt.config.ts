// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/eslint", "@nuxt/ui", "@nuxthub/core", "nuxt-auth-utils"],
  nitro: {
    preset: "cloudflare-pages",
  },
  hub: {
    db: "sqlite",
  },
});
