<script setup lang="ts">
definePageMeta({
  middleware: ["unauthenticated"],
});
</script>

<template>
  <UContainer class="py-8">
    <UCard class="w-6/12 mx-auto">
      <template #header>
        <h1 class="text-4xl text-bold">Авторизация</h1>
        <h3 class="text-xl">Войдите чтобы иметь доступ к записи</h3>
      </template>
      <template #default>
        <div class="space-y-4">
          <LoginForm />
          <p class="text-xl">
            Вы еще не зарегистрированы?
            <NuxtLink
              class="cursor-pointer underline"
              to="/registration"
              >Зарегистрируйтесь</NuxtLink
            >
          </p>
        </div>
      </template>
    </UCard>
  </UContainer>
</template>
