<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  middleware: ["authenticated"],
});
const store = useAuthStore();
onMounted(async () => {
  await store.checkAuth();
});
const user = ref(store.user);
watchEffect(() => {
  user.value = store.user;
});
const openPasswordEdit = ref(false);
const edited = ref<boolean>(false);
function updateOpen() {
  openPasswordEdit.value = !openPasswordEdit.value;
}
// Прокидка необходимых переменных для дочерних компонентов
provide("editForm", {
  edited,
});
provide("user", {
  user,
});
provide("openPasswordEdit", {
  openPasswordEdit,
  updateOpen,
});

const items = [
  {
    label: "Личный кабинет",
    description: "Информации об аккаунте с возможностью изменить.",
    icon: "i-lucide-user",
    slot: "account" as const,
  },
  {
    label: "Записи",
    description: "Ваши записи.",
    icon: "i-lucide-briefcase-medical",
    slot: "records" as const,
  },
] satisfies TabsItem[];
</script>

<template>
  <UContainer class="py-16">
    <div class="grid grid-cols-4 gap-x-8">
      <UCard class="p-6 col-span-1">
        <template #header>
          <div class="space-y-4">
            <h2 class="text-3xl font-bold">
              {{ user?.firstName + " " + user?.lastName + " " + user?.surName }}
            </h2>
            <h4 class="text-xl">Номер телефона: {{ user?.phone }}</h4>
            <h4 class="text-xl">Электронная почта: {{ user?.email }}</h4>
            <p class="text-lg text-gray-700">СНИЛС: {{ user?.snils }}</p>
          </div>
        </template>
      </UCard>
      <UCard class="p-6 col-span-3">
        <UTabs
          :items="items"
          variant="link"
          class="gap-4 w-full"
          :ui="{ trigger: 'flex-1' }"
        >
          <template #account="{ item }">
            <div class="flex item-center justify-between">
              <p class="text-muted mb-4">
                {{ item.description }}
              </p>
              <UButton
                icon="i-lucide-pencil"
                @click="edited = !edited"
                variant="solid"
                size="xl"
                class="self-end cursor-pointer"
              />
            </div>
            <UpdateUserForm />
            <UpdatePassword />
          </template>

          <template #records="{ item }">
            <p class="text-muted mb-4">
              {{ item.description }}
            </p>
          </template>
        </UTabs>
      </UCard>
    </div>
  </UContainer>
</template>
