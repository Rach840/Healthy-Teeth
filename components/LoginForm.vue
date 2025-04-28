<script setup lang="ts">
const { loggedIn, user, fetch: refreshSession } = useUserSession();
import * as z from "zod";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
});

async function login() {
  $fetch("/api/login/login", {
    method: "POST",
    body: state,
  })
    .then(async () => {
      // Refresh the session on client-side and redirect to the home page
      await refreshSession();
      await navigateTo("/");
    })
    .catch(() => alert("Bad credentials"));
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
