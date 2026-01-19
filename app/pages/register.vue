<script setup lang="ts">
import { RegisterSchema } from "#shared/RegisterSchema";

const form = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const isRegistered = useCookie<boolean>("is_registered");

const toast = useToast();

async function onSubmit(event: { data: typeof form }) {
  try {
    await $fetch("/api/auth/register", {
      method: "POST",
      body: event.data,
    });

    toast.add({
      title: "Kayıt Başarılı!",
      description: "Hoş geldin usta, login sayfasına uçuyorsun.",
      color: "success",
      icon: "i-heroicons-check-circle",
    });

    isRegistered.value = true;
    setTimeout(() => navigateTo("/login"), 1500);
  } catch (err) {
    const errorMsg =
      (err as { data?: { message: string } }).data?.message ||
      "Kayıt sırasında bir hata oluştu usta!";

    toast.add({
      title: "Hata!",
      description: errorMsg,
      color: "error",
      icon: "i-heroicons-exclamation-triangle",
    });
  }
}
</script>

<template>
  <UContainer class="flex items-center justify-center h-screen">
    <UPageCard class="flex p-10 rounded-3xl">
      <template #header>
        <h1 class="text-2xl font-bold">Register</h1>
      </template>
      <UForm
        :schema="RegisterSchema"
        :state="form"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Name" name="name">
          <UInput v-model="form.name" class="w-75" />
        </UFormField>
        <UFormField label="Email" name="email">
          <UInput v-model="form.email" class="w-75" />
        </UFormField>
        <UFormField label="Password" name="password">
          <UInput v-model="form.password" class="w-75" type="password" />
        </UFormField>

        <UFormField label="Confirm Password" name="confirmPassword">
          <UInput v-model="form.confirmPassword" class="w-75" type="password" />
        </UFormField>

        <UButton type="submit"> Submit </UButton>
      </UForm>
    </UPageCard>
  </UContainer>
</template>
