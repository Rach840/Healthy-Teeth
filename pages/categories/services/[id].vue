<script lang="ts" setup>
const route = useRoute();
console.log(route.params);
const { data: services } = await useFetch(`/api/services/${route.params.id}`);

console.log(services.value);
</script>
<template>
  <UContainer class="py-12 space-y-8">
    <UCard class="flex items-center bg-blue-100 p-8 justify-between">
      <template #default>
        <div class="flex gap-8 items-center justify-between">
          <img
            class="w-5/12 rounded-xl"
            :src="services?.image"
            :alt="services?.name"
          />
          <div class="w-7/12 space-y-8">
            <h1 class="text-4xl font-bold">{{ services?.name }}</h1>
            <p class="text-lg">
              {{ services?.description }}
            </p>
          </div>
        </div>
      </template>
    </UCard>
    <div
      class="lg:py-8 flex flex-wrap justify-center items-stretch w-full gap-6 text-center text-black"
    >
      <CardCategory v-for="service in services?.services">
        <template #image>
          <img
            :src="service.image"
            class="h-[300px] object-cover w-full"
            alt=""
          />
        </template>
        <template #categoryTitle>{{ service.name }}</template>
        <template #servicesList>
          <div class="space-y-4">
            <p class="text-lg line-clamp-5">
              {{ service.description }}
            </p>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-between items-center">
            <span class="font-bold text-xl">
              {{ service.price ? service.price + " ₽" : "Беслпатно" }}
            </span>
            <UButton
              size="xl"
              color="secondary"
            >
              Записаться</UButton
            >
          </div>
        </template>
      </CardCategory>
    </div>
  </UContainer>
</template>
