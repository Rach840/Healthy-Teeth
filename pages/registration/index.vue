<script setup lang="ts">
definePageMeta({
  middleware: ["unauthenticated"],
});
</script>

<template>
  <UContainer class="py-8">
    <UCard class="w-10/12 mx-auto">
      <template #header>
        <h1 class="text-4xl text-bold">Регистрация</h1>
        <h3 class="text-xl">Зарегистрируйтесь чтобы иметь доступ к записи</h3>
      </template>
      <template #default>
        <div class="space-y-4">
          <RegistrationForm />
          <p class="text-xl">
            Вы уже зарегистрированы?
            <NuxtLink
              class="cursor-pointer underline"
              to="/login"
              >Войдите</NuxtLink
            >
          </p>
        </div>
      </template>
    </UCard>
  </UContainer>
</template>
