<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
});

const { user, clear: clearSession } = useUserSession();

async function logout() {
  await clearSession();
  await navigateTo("/login");
}
</script>

<template>
  <UContainer class="flex items-center justify-center h-screen">
    <UPageCard class="flex p-10 h-90 justify-center items-center rounded-3xl">
      <h1>Welcome {{ user.name }}</h1>
      <UButton @click="logout"> Logout </UButton>
    </UPageCard>
  </UContainer>
</template>
