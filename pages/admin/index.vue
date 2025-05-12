<script lang="ts" setup>
import type { TableColumn } from "@nuxt/ui";
import type { LastOrdersInfo, StatCard } from "~/lib/types";
import { h, resolveComponent } from "vue";

definePageMeta({
  layout: ["admin"],
  middleware: ["admin"],
});
const UBadge = resolveComponent("UBadge");
const config = useRuntimeConfig();
const { token, isAuthenticated } = useAuthStore();
const data = ref<{} | null>(null);
const loading = ref(true);

watchEffect(async () => {
  if (isAuthenticated) {
    const { data: dataResp, status } = await useFetch(
      `${config.public.apiUrl}/admin/dashboard`,
      {
        method: "GET",
        headers: new Headers({
          "Authorization": "Bearer " + token,
        }),
      },
    );
    console.log(dataResp.value, status);
    data.value = dataResp.value;
    loading.value = false;
  }
});

const dashboardStat = ref<StatCard[] | null>(null);

watch(data, () => {
  dashboardStat.value = [
    {
      title: "Пользователи",
      value: `${data.value?.usersCount} пользователя`,
      icon: "i-lucide-users",
      color: "bg-sky-100",
      colorIcon: "bg-sky-600",
    },
    {
      title: "Записей за последний месяц",
      value: `${data.value?.ordersCount} записи`,
      icon: "i-lucide-calendar",
      color: "bg-purple-100",
      colorIcon: "text-purple-600",
    },
    {
      title: "Доход за последний месяц",
      value: `${data.value?.ordersRevenue} рублей`,
      icon: "i-lucide-russian-ruble",
      color: "bg-green-100",
      colorIcon: "text-green-600",
    },
    {
      title: "Услуги за последний месяц",
      value: `${data.value?.popularServices.length} услуги`,
      icon: "i-lucide-activity",
      color: "bg-amber-100",
      colorIcon: "text-amber-600",
    },
  ];
});

const columns: TableColumn<LastOrdersInfo>[] = [
  {
    accessorKey: "userFullName",
    header: "ФИО пользователя",
    cell: ({ row }) => {
      const value = row.getValue("userFullName");
      return h(
        "span",
        {
          class: "ellipsis-cell",
          title: value,
        },
        value.slice(0, 15) + "...",
      );
    },
  },
  {
    accessorKey: "serviceName",
    header: "Услуга",
    cell: ({ row }) => {
      const value = row.getValue("serviceName");
      return h(
        "span",
        {
          class: "ellipsis-cell",
          title: value,
        },
        value.slice(0, 15) + "...",
      );
    },
  },

  {
    accessorKey: "date",
    header: "Дата",
    cell: ({ row }) => {
      return new Date(row.getValue("date")).toLocaleString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour12: false,
      });
    },
  },
  {
    accessorKey: "status",
    header: "Статус",
    cell: ({ row }) => {
      const color = {
        PROVIDED: "success" as const,
        WAITING: "neutral" as const,
      }[row.getValue("status") as string];

      return h(UBadge, { class: "capitalize", variant: "subtle", color }, () =>
        row.getValue("status") == "PROVIDED" ? "Оказана" : "Ожидает",
      );
    },
  },
];

console.log(dashboardStat.value);
</script>

<template>
  <h1 class="text-md sm:text-lg md:text-2xl lg:text-4xl font-bold mb-6">
    Главная
  </h1>

  <div class="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-8">
    <AdminStatisticCard v-for="stat in dashboardStat">
      <template #title>{{ stat.title }}</template>
      <template #value>{{ stat.value }}</template>
      <template #icon>
        <div :class="stat.color + ' p-3 w-[48px] h-[48px] rounded-lg'">
          <UIcon
            :name="stat.icon"
            :class="'!size-6 ' + stat.colorIcon"
          />
        </div>
      </template>
    </AdminStatisticCard>
  </div>

  <div class="grid grid-cols-2 gap-6 mt-8">
    <UCard class="p-6">
      <h3 class="text-2xl font-semibold mb-4">Последние записи</h3>
      <UTable
        :data="data?.lastOrders.splice(0, 5)"
        ref="table"
        sticky
        :loading="loading"
        loading-color="info"
        loading-animation="carousel"
        :columns="columns"
      />
    </UCard>

    <UCard class="p-6">
      <h3 class="text-2xl font-semibold mb-4">Топ услуг</h3>
      <div class="space-y-4">
        <div
          v-for="(service, index) in data?.popularServices"
          class="flex justify-between items-center"
        >
          <div class="flex items-center">
            <div
              class="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center mr-3"
            >
              <span class="text-sky-600 font-medium">{{ index + 1 }}</span>
            </div>
            <div>
              <p class="font-medium">{{ service.name }}</p>
              <p class="text-sm text-gray-500">{{ service.categoryName }}</p>
            </div>
          </div>
          <p class="font-medium">{{ service.price }} ₽</p>
        </div>
      </div>
    </UCard>
  </div>
</template>
