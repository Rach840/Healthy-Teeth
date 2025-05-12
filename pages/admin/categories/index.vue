<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { CategoryFullInfo } from "~/lib/types";

definePageMeta({
  layout: ["admin"],
  middleware: ["admin"],
});
const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const config = useRuntimeConfig();
const { token, isAuthenticated } = useAuthStore();
const categories = ref<[] | null>(null);
const loading = ref(true);
watchEffect(async () => {
  if (isAuthenticated) {
    const { data: categoriesResp, status } = await useFetch(
      `${config.public.apiUrl}/admin/categories`,
      {
        method: "GET",
        headers: new Headers({
          "Authorization": "Bearer " + token,
        }),
      },
    );
    console.log(categoriesResp.value, status);
    categories.value = categoriesResp.value;
    loading.value = false;
  }
});

const columnCategoryLabels: Record<string, string> = {
  expanded: "",
  id: "ID",
  name: "Название категории",
  doctorFullName: "ФИО врача",
  description: "Описание категории",
  ordersActive: "Активных записей ",
  ordersByCategory: "Всего записей",
};
const columnServiceLabels: Record<string, string> = {
  id: "ID",
  name: "Название услуги",
  description: "Описание услуги",
  ordersActiveByService: "Активных записей ",
  orders: "Всего записей",
  amount: "Всего заработанно",
};

const columns: TableColumn<CategoryFullInfo>[] = [
  {
    id: "expand",
    cell: ({ row }) =>
      h(UButton, {
        color: "neutral",
        variant: "ghost",
        icon: "i-lucide-chevron-down",
        square: true,
        "aria-label": "Expand",
        ui: {
          leadingIcon: [
            "transition-transform",
            row.getIsExpanded() ? "duration-200 rotate-180" : "",
          ],
        },
        onClick: () => row.toggleExpanded(),
      }),
  },
  {
    accessorKey: "id",
    header: columnCategoryLabels["id"],
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "name",
    header: columnCategoryLabels["name"],
  },
  {
    accessorKey: "doctorFullName",
    header: columnCategoryLabels["doctorFullName"],
    cell: ({ row }) => {
      return `${row.original.doctor.lastName}  ${row.original.doctor.firstName} ${row.original.doctor.surName} `;
    },
  },
  {
    accessorKey: "description",
    header: columnCategoryLabels["description"],
    cell: ({ row }) => {
      const value = row.getValue("description");
      return h(
        "span",
        {
          class: "ellipsis-cell",
          title: value,
        },
        value.slice(0, 25) + "...",
      );
    },
  },
  {
    accessorKey: "ordersActive",
    header: columnCategoryLabels["ordersActive"],
    cell: ({ row }) => {
      return `${row.getValue("ordersActive")} заявок `;
    },
  },
  {
    accessorKey: "ordersByCategory",
    header: () =>
      h(
        "div",
        { class: "text-right" },
        columnCategoryLabels["ordersByCategory"],
      ),
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-right" },
        ` ${row.getValue("ordersByCategory")} заявок `,
      );
    },
  },
];

const columnsServices: TableColumn<CategoryFullInfo>[] = [
  {
    accessorKey: "id",
    header: columnServiceLabels["id"],
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "name",
    header: columnServiceLabels["name"],
  },
  {
    accessorKey: "description",
    header: columnServiceLabels["description"],
    cell: ({ row }) => {
      const value = row.getValue("description");
      return h(
        "span",
        {
          class: "ellipsis-cell",
          title: value,
        },
        value.slice(0, 40) + "...",
      );
    },
  },
  {
    accessorKey: "ordersActiveByService",
    header: columnServiceLabels["ordersActiveByService"],
    cell: ({ row }) => {
      return `${row.getValue("ordersActiveByService")} заявок `;
    },
  },
  {
    accessorKey: "orders",
    header: columnServiceLabels["orders"],
    cell: ({ row }) => {
      return `${row.getValue("orders").length} заявок `;
    },
  },

  {
    accessorKey: "amount",
    header: () =>
      h("div", { class: "text-right" }, columnServiceLabels["amount"]),
    cell: ({ row }) => {
      const sum = row.original?.orders.length * row.original?.price;

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "RUB",
      }).format(sum);

      return h("div", { class: "text-right font-bold" }, formatted);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return h(UButton, {
        label: "Подробнее",
        color: "info",
        variant: "solid",
        to: `/admin/categories/${row.getValue("id")}`,
        class: "ml-auto",
        "aria-label": "Actions dropdown",
      });
    },
  },
];

const expanded = ref({ 1: true });
</script>

<template>
  <div class="container mx-auto">
    <UTable
      v-model:expanded="expanded"
      :data="categories"
      :loading="loading"
      loading-color="info"
      loading-animation="carousel"
      :columns="columns"
      :ui="{
        tr: 'data-[expanded=true]:bg-elevated/50',
      }"
      class="flex-1"
    >
      <template #expanded="{ row }">
        <UTable
          :data="row.original.services"
          :loading="loading"
          loading-color="info"
          loading-animation="carousel"
          :columns="columnsServices"
          :ui="{
            root: 'p-0 pb-4 pl-6',
            tr: 'bg-elevated/50',
          }"
          class="flex-1"
        />
      </template>
    </UTable>
  </div>
</template>
<style>
td[colspan="7"] {
  padding: 0;
}
</style>
