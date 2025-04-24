<script setup lang="ts"></script>

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
