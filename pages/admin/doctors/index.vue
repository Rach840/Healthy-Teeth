<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";

definePageMeta({
  layout: ["admin"],
  middleware: ["admin"],
});
const table = useTemplateRef("table");
const config = useRuntimeConfig();
const { token, isAuthenticated } = useAuthStore();
const doctors = ref<[] | null>(null);

const UButton = resolveComponent("UButton");
const loading = ref(true);
watchEffect(async () => {
  if (isAuthenticated) {
    const { data: doctorsResp, status } = await useFetch(
      `${config.public.apiUrl}/admin/doctors`,
      {
        method: "GET",
        headers: new Headers({
          "Authorization": "Bearer " + token,
        }),
      },
    );
    console.log(doctorsResp.value, status);
    doctors.value = doctorsResp.value;
    loading.value = false;
  }
});
const columnServiceExportLabels: Record<string, string> = {
  id: "ID",
  categoryName: "Название категории",
  ordersActiveByService: "Количество активных записей",
  firstName: "Имя врача",
  lastName: "Фамилия врача",
  surName: "Отчество врача",
  image: "Аватар",
  description: "Описание",
  userId: "Id пользователя",
  email: "Электронная почта",
  categoryId: "ID категории",
  experience: "Опыт",
  post: "Должность",
  ordersByDoctor: "Количество записей",
  ordersActive: "Количество активных записей",
  ordersAmount: "Сумма записей",
};
const columnDoctorLabels: Record<string, string> = {
  id: "ID",
  fullName: "ФИО врача",
  description: "Описание врача",
  ordersActive: "Активных записей ",
  ordersByDoctor: "Всего записей",
  email: "Почта",
  categoryName: "Название категории",
  experience: "Опыт",
  post: "Должность",
  ordersAmount: "Сумма записей",
};

const columns: TableColumn<{}>[] = [
  {
    accessorKey: "id",
    header: columnDoctorLabels["id"],
    cell: ({ row }) => `#${row.getValue("id")}`,
  },

  {
    accessorKey: "fullName",
    header: columnDoctorLabels["fullName"],
    cell: ({ row }) => {
      return `${row.original.lastName}  ${row.original.firstName} ${row.original.surName} `;
    },
  },
  {
    accessorKey: "email",
    header: columnDoctorLabels["email"],
  },
  {
    accessorKey: "post",
    header: columnDoctorLabels["post"],
  },
  {
    accessorKey: "experience",
    header: columnDoctorLabels["experience"],
  },
  {
    accessorKey: "description",
    header: columnDoctorLabels["description"],
    cell: ({ row }) => {
      const value = row.getValue("description");
      return h(
        "span",
        {
          class: "ellipsis-cell",
          title: value,
        },
        value.slice(0, 17) + "...",
      );
    },
  },
  {
    accessorKey: "categoryName",
    header: columnDoctorLabels["categoryName"],
    cell: ({ row }) => {
      const value = row.getValue("categoryName");
      return h(
        "span",
        {
          class: "ellipsis-cell",
          title: value,
        },
        value.slice(0, 17) + "...",
      );
    },
  },
  {
    accessorKey: "ordersActive",
    header: columnDoctorLabels["ordersActive"],
    cell: ({ row }) => {
      return `${row.getValue("ordersActive")} заявок `;
    },
  },
  {
    accessorKey: "ordersByDoctor",
    header: () =>
      h("div", { class: "text-right" }, columnDoctorLabels["ordersByDoctor"]),
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-right" },
        ` ${row.getValue("ordersByDoctor")} заявок `,
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return h(UButton, {
        label: "Подробнее",
        color: "info",
        variant: "solid",
        to: `/admin/doctors/${row.getValue("id")}`,
        class: "ml-auto",
        "aria-label": "Actions dropdown",
      });
    },
  },
];
//
// const columnsServices: TableColumn<CategoryFullInfo>[] = [
//   {
//     accessorKey: "id",
//     header: columnServiceLabels["id"],
//     cell: ({ row }) => `#${row.getValue("id")}`,
//   },
//   {
//     accessorKey: "name",
//     header: columnServiceLabels["name"],
//   },
//   {
//     accessorKey: "description",
//     header: columnServiceLabels["description"],
//     cell: ({ row }) => {
//       const value = row.getValue("description");
//       return h(
//         "span",
//         {
//           class: "ellipsis-cell",
//           title: value,
//         },
//         value.slice(0, 40) + "...",
//       );
//     },
//   },
//   {
//     accessorKey: "ordersActiveByService",
//     header: columnServiceLabels["ordersActiveByService"],
//     cell: ({ row }) => {
//       return `${row.getValue("ordersActiveByService")} заявок `;
//     },
//   },
//   {
//     accessorKey: "orders",
//     header: columnServiceLabels["orders"],
//     cell: ({ row }) => {
//       return `${row.getValue("orders").length} заявок `;
//     },
//   },
//
//   {
//     accessorKey: "amount",
//     header: () =>
//       h("div", { class: "text-right" }, columnServiceLabels["amount"]),
//     cell: ({ row }) => {
//       const sum = row.original?.orders.length * row.original?.price;
//
//       const formatted = new Intl.NumberFormat("en-US", {
//         style: "currency",
//         currency: "RUB",
//       }).format(sum);
//
//       return h("div", { class: "text-right font-bold" }, formatted);
//     },
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       return h(UButton, {
//         label: "Подробнее",
//         color: "info",
//         variant: "solid",
//         to: `/admin/categories/${row.getValue("id")}`,
//         class: "ml-auto",
//         "aria-label": "Actions dropdown",
//       });
//     },
//   },
// ];
const globalFilter = ref<string>("");
const expanded = ref({});
</script>

<template>
  <div class="container mx-auto">
    <h1 class="text-md sm:text-lg md:text-2xl lg:text-4xl font-bold mb-6">
      Доктора
    </h1>
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
          <ExportButton
            :data="doctors"
            :column-labels="columnServiceExportLabels"
            name="Отчет по докторам "
          />
          <DropDownSort
            :table="table"
            :column-labels="columnDoctorLabels"
          />
        </div>
      </template>
      <template #default>
        <UTable
          v-model:expanded="expanded"
          :data="doctors"
          :loading="loading"
          loading-color="info"
          loading-animation="carousel"
          :columns="columns"
          ref="table"
          v-model:global-filter="globalFilter"
          class="flex-1"
        />
      </template>
    </UCard>
  </div>
</template>
