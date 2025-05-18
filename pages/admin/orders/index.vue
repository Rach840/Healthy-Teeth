<script setup lang="ts">
import type { OrdersTable, User } from "~/lib/types";
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { Column } from "@tanstack/vue-table";
import {
  getHeaderButtonProps,
  getHeaderDropDownProps,
  sorting,
} from "~/lib/getHeader";
import { exportFile } from "~/lib/export-table";

definePageMeta({
  layout: ["admin"],
  middleware: ["admin"],
});
const table = useTemplateRef("table");
const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const config = useRuntimeConfig();
const { token, isAuthenticated } = useAuthStore();
const orders = ref<OrdersTable[] | null>(null);
const loading = ref(true);
watchEffect(async () => {
  if (isAuthenticated) {
    const { data: ordersResp, status } = await useFetch(
      `${config.public.apiUrl}/admin/orders`,
      {
        method: "GET",
        headers: new Headers({
          "Authorization": "Bearer " + token,
        }),
      },
    );
    console.log(ordersResp.value, status);
    orders.value = ordersResp.value;
    loading.value = false;
  }
});

const columnLabels: Record<string, string> = {
  id: "ID",
  userId: "ID Клиента",
  userFullName: "ФИО клиента",
  userEmail: "Почта клиента",
  userPhone: "Номер клиента",
  serviceName: "Название услуги",
  status: "Статус",
  date: "Дата",
  price: "Цена",
};
function getHeader(column: Column<User>, label: string) {
  const isSorted = column.getIsSorted();

  return h(UDropdownMenu, getHeaderDropDownProps(isSorted, column), () =>
    h(UButton, getHeaderButtonProps(isSorted, label)),
  );
}
const columns: TableColumn<OrdersTable>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => getHeader(column, columnLabels["id"]),
  },
  {
    accessorKey: "userId",
    header: ({ column }) => getHeader(column, columnLabels["userId"]),
  },
  {
    accessorKey: "userFullName",
    header: columnLabels["userFullName"],
  },
  {
    accessorKey: "userEmail",
    header: columnLabels["userEmail"],
    cell: ({ row }) => row.getValue("userEmail"),
  },
  {
    accessorKey: "userPhone",
    header: columnLabels["userPhone"],
  },
  {
    accessorKey: "serviceName",
    header: columnLabels["serviceName"],
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
    accessorKey: "status",
    header: ({ column }) => getHeader(column, columnLabels["status"]),
    cell: ({ row }) => {
      const color = {
        PROVIDED: "success" as const,
        WAITING: "neutral" as const,
      }[row.getValue("status") as string];

      return h(
        UBadge,
        { class: "capitalize", size: "xl", variant: "subtle", color },
        () => (row.getValue("status") == "PROVIDED" ? "Оказана" : "Ожидает"),
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => getHeader(column, columnLabels["date"]),
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
    accessorKey: "price",
    header: ({ column }) => getHeader(column, columnLabels["price"]),
    cell: ({ row }) => {
      return row.getValue("price") ? `${row.getValue("price")} ₽` : "Бесплатно";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return h(UButton, {
        label: "Подробнее",
        color: "info",
        variant: "solid",
        to: `/admin/orders/${row.getValue("id")}`,
        class: "ml-auto",
        "aria-label": "Actions dropdown",
      });
    },
  },
];

const statistic = ref();
watch(orders, () => {
  statistic.value = [
    {
      title: "Всего заявок:",
      data: orders.value?.length + " заявок",
    },
    {
      title: "Выполненных заявок:",
      data:
        orders.value?.filter((item) => item?.status == "PROVIDED").length +
        " заявок",
    },
    {
      title: "Заявок в ожидании:",
      data:
        orders.value?.filter((item) => item?.status == "WAITING").length +
        " заявок",
    },
    {
      title: "Всего заявок:",
      data:
        orders.value
          ?.filter((item) => item?.status == "WAITING")
          .reduce((acc, item) => item.price + acc, 0) + " рублей",
    },
  ];
});
watch(orders, () => {
  statistic.value = [
    {
      title: "Всего заявок",
      value: orders.value?.length + " заявок",
      icon: "i-lucide-file",
      color: "bg-sky-100",
      colorIcon: "bg-sky-600",
    },
    {
      title: "Выполненных заявок",
      value:
        orders.value?.filter((item) => item?.status == "PROVIDED").length +
        " заявок",
      icon: "i-lucide-file-check",
      color: "bg-purple-100",
      colorIcon: "text-purple-600",
    },
    {
      title: "Заявок в ожидании",
      value:
        orders.value?.filter((item) => item?.status == "WAITING").length +
        " заявок",
      icon: "i-lucide-activity",
      color: "bg-amber-100",
      colorIcon: "text-amber-600",
    },
    {
      title: "Доход",
      value:
        orders.value
          ?.filter((item) => item?.status == "WAITING")
          .reduce((acc, item) => item.price + acc, 0) + " рублей",
      icon: "i-lucide-russian-ruble",
      color: "bg-green-100",
      colorIcon: "text-green-600",
    },
  ];
});

const globalFilter = ref<string>("");
</script>

<template>
  <div class="flex-1 container mx-auto w-full">
    <h1 class="text-md sm:text-lg md:text-2xl lg:text-4xl font-bold mb-6">
      Записи
    </h1>
    <div class="grid grid-cols-4 my-8 gap-8 border-none">
      <AdminStatisticCard v-for="stat in statistic">
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
    <UCard
      :ui="{
        body: 'px-0 md:px-0',
      }"
    >
      <template #header>
        <div class="flex items-center gap-2 px-4 py-3.5 overflow-x-auto">
          <UInput
            v-model="globalFilter"
            class="max-w-sm min-w-[12ch]"
            size="xl"
            placeholder="Фильтры..."
          />
          <UButton
            variant="outline"
            icon="i-lucide-file"
            size="xl"
            color="info"
            class="ml-auto"
            @click="() => exportFile(orders, 'Пользователи')"
            >Экспорт</UButton
          >
          <DropDownSort
            :table="table"
            :column-labels="columnLabels"
          />
        </div>
      </template>
      <UTable
        v-model:sorting="sorting"
        :data="orders"
        ref="table"
        sticky
        :loading="loading"
        loading-color="info"
        loading-animation="carousel"
        :columns="columns"
        v-model:global-filter="globalFilter"
        class=""
      >
        <template #expanded="{ row }">
          <pre>{{ row.original }}</pre>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
