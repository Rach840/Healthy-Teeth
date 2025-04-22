<script lang="ts" setup>
const { data: categories, status } = await useFetch("/api/category");
</script>
<template>
  <UContainer class="py-16">
    <h2 class="text-4xl font-bold mb-6 text-center">Наши услуги</h2>
    <div class="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <CardCategory v-if="status === 'success'" v-for="category in categories">
        <template #image>
          <img
            :src="category.image"
            class="w-full h-[230px] object-cover"
            alt=""
          />
        </template>
        <template #categoryTitle>{{ category.name }}</template>
        <template #servicesList>
          <li class="text-xl underline" v-for="service in category.services">
            {{ service.name }}
          </li>
        </template>
        <template #footer>
          <UButton
            trailing-icon="i-lucide-arrow-right"
            :to="`services/${category.id}`"
            color="secondary"
            size="xl"
          >
            Подбробнее о категории
          </UButton>
        </template>
      </CardCategory>
    </div>
  </UContainer>
</template>
