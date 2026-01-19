<script setup lang="ts">
useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "en",
    class: "dark",
  },
});

const title = "Auth Project";
const description = "A production-ready starter template powered by Nuxt UI.";

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: "https://ui.nuxt.com/assets/templates/nuxt/starter-light.png",
  twitterImage: "https://ui.nuxt.com/assets/templates/nuxt/starter-light.png",
  twitterCard: "summary_large_image",
});

const { loggedIn, clear } = useUserSession();
const isRegistered = useCookie<boolean>("is_registered", {
  default: () => false,
});

async function logout() {
  await clear();
  await navigateTo("/login");
}
</script>

<template>
  <UApp>
    <UHeader>
      <template #right>
        <div class="flex gap-4 items-center">
          <div class="flex gap-2">
            <UButton
              v-if="loggedIn"
              variant="outline"
              size="sm"
              class="border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white"
              @click="logout"
            >
              Logout
            </UButton>

            <template v-else>
              <UButton
                v-if="!isRegistered"
                to="/register"
                variant="outline"
                size="sm"
                class="border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white"
              >
                Register
              </UButton>
              <UButton
                v-else
                to="/login"
                size="sm"
                class="bg-white text-black hover:bg-zinc-200"
              >
                Login
              </UButton>
            </template>
          </div>
        </div>
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>
    <USeparator />

    <UFooter />
  </UApp>
</template>
