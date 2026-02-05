// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/eslint", "@nuxt/ui", "@nuxthub/core", "nuxt-auth-utils"],
  auth: {
    hash: {
      scrypt: {
        // Cloudflare Workers uyumlu parametreler
        cost: 16384, // N parametresi (default: 16384)
        blockSize: 8, // r parametresi
        parallelization: 1, // p parametresi
      },
    },
  },
  nitro: {
    preset: "cloudflare-pages",
  },
  hub: {
    db: "sqlite",
  },
});
