<script lang="ts" setup>
const route = useRoute();
const config = useRuntimeConfig();
const { data: services } = await useFetch(
  `${config.public.apiUrl}/category/${route.params.id}`,
);
console.log(services);
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
      class="lg:py-8 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full text-center text-black"
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
            <BuyModal
              :product="{
                id: service.id,
                title: service.name,
                doctorId: service.doctorId,
              }"
            >
              <UButton
                color="info"
                variant="solid"
                size="xl"
                >Записаться</UButton
              >
            </BuyModal>
          </div>
        </template>
      </CardCategory>
    </div>
  </UContainer>
</template>
