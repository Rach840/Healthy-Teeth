<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // toast.add({
  //   title: "Success",
  //   description: "The form has been submitted.",
  //   color: "success",
  // });
  console.log(event.data);
}
</script>

<template>
  <UContainer class="py-8">
    <UCard class="w-10/12 mx-auto">
      <template #header>
        <h1 class="text-4xl text-bold">Регистрация</h1>
        <h3 class="text-xl">Зарегистрируйтесь чтобы иметь доступ к записи</h3>
      </template>
      <template #default>
        <RegistrationForm />
      </template>
    </UCard>
  </UContainer>
</template>
