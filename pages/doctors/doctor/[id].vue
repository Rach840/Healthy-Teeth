<script setup lang="ts">
const route = useRoute();
const config = useRuntimeConfig();
const { data: doctor } = await useFetch(
  `${config.public.apiUrl}/doctors/${route.params.id}`,
);
const description = ref(JSON.parse(doctor.value.description));
</script>

<template>
  <UContainer class="py-12 space-y-8">
    <UCard class="flex items-center bg-blue-100 p-8 justify-between">
      <template #default>
        <div class="flex gap-8 items-center justify-between">
          <img
            class="w-5/12 h-[600px] object-top object-cover rounded-xl"
            :src="doctor?.image"
            :alt="doctor?.firstName"
          />
          <div class="w-7/12 space-y-8">
            <div class="space-y-4">
              <h1 class="text-4xl font-bold">
                {{
                  doctor?.firstName +
                  " " +
                  doctor?.lastName +
                  " " +
                  doctor?.surName
                }}
              </h1>
              <h3 class="text-2xl">Стаж: {{ doctor.experience }}</h3>
              <p class="text-lg">
                {{ description.description }}
              </p>
            </div>
            <div class="space-y-3">
              <h3 class="text-xl text-bold">Образование и курсы</h3>
              <ul class="space-y-3 list-disc list-inside">
                <li
                  class="text-lg"
                  v-for="education in description.education"
                >
                  {{ education }}
                </li>
              </ul>
            </div>
            <div class="space-y-3">
              <blockquote class="italic text-2xl">
                <p>{{ description.quotes }}</p>
              </blockquote>
              <p>— Цитаты врача</p>
            </div>
          </div>
        </div>
      </template>
    </UCard>
    <div
      class="lg:py-8 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full text-center text-black"
    >
      <CardCategory v-for="service in doctor?.services">
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
              class="cursor-pointer"
              color="info"
            >
              Записаться</UButton
            >
          </div>
        </template>
      </CardCategory>
    </div>
  </UContainer>
</template>
