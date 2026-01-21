<script setup lang="ts">
import { LoginSchema } from "#shared/LoginSchema";

const { fetch: refreshSession } = useUserSession();

const credentials = reactive({
  email: "",
  password: "",
});

const providers = [
  {
    label: "Google",
    icon: "i-simple-icons-google",
    onClick: () => {
      window.location.href = "api/auth/google";
    },
  },
  {
    label: "GitHub",
    icon: "i-simple-icons-github",
    onClick: () => {
      window.location.href = "api/auth/github";
    },
  },
];

const isRegistered = useCookie<boolean>("is_registered");

async function login() {
  try {
    await $fetch("api/auth/login", {
      method: "POST",
      body: credentials,
    });

    isRegistered.value = true;
    await refreshSession();
    await navigateTo("/main");
  } catch {
    alert("Bad credentials");
  }
}
</script>

<template>
  <UContainer class="flex items-center justify-center h-screen">
    <UPageCard
      class="flex p-10 justify-center items-center rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800"
    >
      <template #header>
        <h1 class="text-2xl font-bold mb-3">Login</h1>
      </template>

      <UForm
        :schema="LoginSchema"
        :state="credentials"
        class="flex flex-col gap-4"
        @submit.prevent="login"
      >
        <UFormField name="email">
          <UInput
            v-model="credentials.email"
            class="w-65"
            type="email"
            placeholder="Email"
          />
        </UFormField>
        <UFormField name="password">
          <UInput
            v-model="credentials.password"
            class="w-65"
            type="password"
            placeholder="Password"
          />
        </UFormField>
        <UButton type="submit" class="w-full justify-center mt-2">
          Login
        </UButton>

        <div class="flex flex-col gap-4 mt-2">
          <div class="flex items-center gap-2">
            <span class="h-px bg-gray-200 dark:bg-gray-800 flex-1" />
            <span class="text-xs text-gray-400 uppercase font-medium"
              >veya</span
            >
            <span class="h-px bg-gray-200 dark:bg-gray-800 flex-1" />
          </div>

          <div class="flex flex-col gap-2">
            <UButton
              v-for="provider in providers"
              :key="provider.label"
              :icon="provider.icon"
              block
              color="neutral"
              variant="outline"
              class="w-full justify-center p-3"
              @click="provider.onClick"
            >
              {{ provider.label }} ile Giriş Yap
            </UButton>
          </div>
        </div>
      </UForm>
    </UPageCard>
  </UContainer>
</template>
