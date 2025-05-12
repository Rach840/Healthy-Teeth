<script setup lang="ts">
import * as z from "zod";
import { useAuthStore } from "~/stores/auth";

const toast = useToast();
const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
});
const store = useAuthStore();
type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
});
const config = useRuntimeConfig();
async function login() {
  const response = await $fetch(`${config.public.apiUrl}/auth/login`, {
    method: "POST",
    body: state,
    credentials: "include",
  }).catch((e) => {
    console.log(e);
    switch (e.status) {
      case 401:
        toast.add({
          title: "Не верный пароль",
          color: "error",
          icon: "i-lucide-circle-x",
        });
        break;
      case 406:
        toast.add({
          title: "Такого пользователя нету",
          color: "error",
          icon: "i-lucide-circle-x",
        });
        break;
      default:
        toast.add({
          title: "Не предвидимая ошибка.",
          description: "Разработчик уже чинит ошибочку.",
          color: "error",
          icon: "i-lucide-circle-x",
        });
        break;
    }
  });

  if (response?.accessToken) {
    await store.refresh();
    toast.add({
      title: "Вы вошли.",
      description: "Разработчик уже чинит ошибочку.",
      icon: "i-lucide-circle-x",
    });
  }
  // await navigateTo("/profile");
}
</script>
<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-4 flex justify-center items-center flex-col"
    @submit="login"
  >
    <UFormField
      label="Электронная почта"
      name="email"
      size="xl"
      class="w-9/12"
      required
    >
      <UInput
        class="w-full"
        v-model="state.email"
      />
    </UFormField>

    <UFormField
      label="Пароль"
      name="password"
      size="xl"
      class="w-9/12"
      required
    >
      <UInput
        class="w-full"
        v-model="state.password"
        type="password"
      />
    </UFormField>

    <UButton
      size="xl"
      type="submit"
      class="text-xl cursor-pointer px-9"
      color="info"
    >
      Войти
    </UButton>
  </UForm>
</template>
