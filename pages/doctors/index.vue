<script lang="ts" setup>
const config = useRuntimeConfig();
const { data: doctors, status } = await useFetch(
  `${config.public.apiUrl}/doctors/`,
);
</script>
<template>
  <UContainer class="py-16">
    <h2 class="text-4xl font-bold mb-6 text-center">Наши специалисты</h2>
    <div class="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <CardCategory
        v-if="status === 'success'"
        v-for="doctor in doctors"
      >
        <template #image>
          <img
            :src="doctor.image"
            class="w-full h-[450px] object-top object-cover"
            alt=""
          />
        </template>
        <template #categoryTitle>{{
          doctor.firstName + " " + doctor.lastName + " " + doctor.surName
        }}</template>
        <template #default>
          <h3 class="text-xl">Стаж: {{ doctor.experience }}</h3>
        </template>
        <template #servicesList>
          <li
            class="text-xl underline"
            v-for="service in doctor.services"
          >
            {{ service.name }}
          </li>
        </template>
        <template #footer>
          <UButton
            trailing-icon="i-lucide-arrow-right"
            :to="`/doctors/doctor/${doctor?.id}`"
            color="info"
            class="cursor-pointer"
            size="xl"
          >
            Подробнее
          </UButton>
        </template>
      </CardCategory>
    </div>
  </UContainer>
</template>
