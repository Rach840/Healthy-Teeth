<script setup lang="ts">
import { Edit, Trash2 } from "lucide-vue-next";
import type { OrderWithUser, ServiceFullInfo, User } from "~/lib/types";
import { type Column, getPaginationRowModel } from "@tanstack/vue-table";
import { h, resolveComponent } from "vue";
import {
  getHeaderButtonProps,
  getHeaderDropDownProps,
  sorting,
} from "~/lib/getHeader";
import type { TableColumn } from "@nuxt/ui";

definePageMeta({
  layout: ["admin"],
  middleware: ["admin"],
});
const config = useRuntimeConfig();
const { token, isAuthenticated } = useAuthStore();
const table = useTemplateRef("table");
const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const serviceFullInfo = ref<ServiceFullInfo | null>(null);
const route = useRoute();
const loading = ref<boolean>(true);
watchEffect(async () => {
  if (isAuthenticated) {
    const { status: statusResp, data: serviceResp } =
      await useFetch<ServiceFullInfo>(
        `${config.public.apiUrl}/admin/serviceOne/${route.params.id}`,
        {
          method: "GET",
          headers: new Headers({
            "Authorization": "Bearer " + token,
          }),
        },
      );
    serviceFullInfo.value = serviceResp.value;
    loading.value = statusResp.value;
  }
});

watch(loading, () => {
  console.log("stat", loading);
  console.log("stat", serviceFullInfo.value);
});
const lastOrderDate = computed(() => {
  if (!serviceFullInfo.value?.lastOrder) return "Нету";
  return new Date(serviceFullInfo.value?.lastOrder).toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
});

const columnLabels: Record<string, string> = {
  id: "ID",
  userFullName: "ФИО пользователя",
  phone: "Телефон пользователя",
  email: "Почта пользователя",
  gender: "Пол пользователя",
  status: "Статус",
  date: "Дата",
};
const columnExportLabels: Record<string, string> = {
  id: "ID заказа",
  doctorId: "ID доктора",
  serviceId: "ID услуги",
  userId: "ID пользователя",
  createdAt: "Дата создание заказа",
  price: "Цена",
  firstName: "Имя пользователя",
  lastName: "Фамилия пользователя",
  surName: "Отчество пользователя",
  phone: "Телефон пользователя",
  email: "Почта пользователя",
  gender: "Пол пользователя",
  birth: "День рождения пользователя",
  status: "Статус",
  date: "Дата",
};

function getHeader(column: Column<User>, label: string) {
  const isSorted = column.getIsSorted();

  return h(UDropdownMenu, getHeaderDropDownProps(isSorted, column), () =>
    h(UButton, getHeaderButtonProps(isSorted, label)),
  );
}
const columns: TableColumn<OrderWithUser>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => getHeader(column, columnLabels["id"]),
  },
  {
    accessorKey: "userFullName",
    header: ({ column }) => getHeader(column, columnLabels["userFullName"]),
    cell: ({ row }) => {
      return `${row.original.lastName}  ${row.original.firstName} ${row.original.surName} `;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => getHeader(column, columnLabels["email"]),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => getHeader(column, columnLabels["phone"]),
  },
  {
    accessorKey: "gender",
    header: ({ column }) => getHeader(column, columnLabels["gender"]),
    cell: ({ row }) =>
      row.getValue("gender") == "MALE"
        ? "Мужской"
        : row.getValue("gender") == "FEMALE"
          ? "Женский"
          : "Не найдено",
  },
  {
    accessorKey: "status",
    header: ({ column }) => getHeader(column, columnLabels["status"]),
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
  {
    accessorKey: "date",
    header: ({ column }) => getHeader(column, columnLabels["date"]),
    cell: ({ row }) => {
      return new Date(row.getValue("date")).toLocaleString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      });
    },
  },
];

const pagination = ref({
  pageIndex: 0,
  pageSize: 5,
});
const globalFilter = ref<string>("");
const openModal = ref(false);
const printOrder = () => {
  window.print();
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="no-print flex justify-between items-center mb-6">
      <UButton
        variant="solid"
        color="info"
        icon="i-lucide-arrow-left"
        class="cursor-pointer"
        to="/admin/categories"
        size="xl"
      >
        Вернутся к заявкам
      </UButton>
      <UButton
        variant="solid"
        color="primary"
        size="xl"
        icon="i-lucide-printer"
        class="cursor-pointer"
        @click="printOrder"
      >
        Распечатать
      </UButton>
    </div>

    <div class="print-only mb-6">
      <h1 class="text-center text-2xl font-bold">Детали заявки</h1>
      <p class="text-center text-sm">
        Распечатано: {{ new Date().toLocaleString("ru-RU") }}
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <UCard class="p-3 lg:col-span-2">
        <template #header>
          <div class="flex p-2 justify-between items-start">
            <div class="space-y-2">
              <h2 class="text-2xl font-bold">
                {{ serviceFullInfo?.service.name }}
              </h2>
              <p class="text-gray-500 text-xl">
                {{ serviceFullInfo?.service.categoryName }}
              </p>
            </div>
            <div class="space-y-3 flex-col flex items-strech">
              <UButton
                color="info"
                class="flex items-center cursor-pointer gap-1"
              >
                <Edit class="size-8" />
                <span>Изменить</span>
              </UButton>
              <UButton
                color="error"
                class="flex items-center cursor-pointer gap-1"
              >
                <Trash2 class="size-8" />
                <span>Удалить</span>
              </UButton>
            </div>
          </div>
        </template>
        <template #default>
          <div class="p-3">
            <h3 class="text-2xl font-semibold mb-3">Описание</h3>
            <p class="text-lg mb-6">
              {{ serviceFullInfo?.service.description }}
            </p>
          </div>
        </template>
      </UCard>

      <UCard class="mb-6">
        <template #header>
          <div class="p-3">
            <h3 class="text-2xl font-semibold">Информация о услуги</h3>
          </div>
        </template>
        <template #default>
          <div class="p-6">
            <div class="space-y-4">
              <div>
                <p class="text-lg text-gray-500 mb-1">Цена</p>
                <p class="font-medium text-xl">
                  {{ serviceFullInfo?.service.price }} рублей
                </p>
              </div>

              <div>
                <p class="text-lg text-gray-500 mb-1">Всего заработано</p>
                <p class="font-medium text-xl">
                  {{ serviceFullInfo?.ordersSum }} рублей
                </p>
              </div>

              <div>
                <p class="text-lg text-gray-500 mb-1">Дата последней записи</p>
                <p class="font-medium text-xl">{{ lastOrderDate }}</p>
              </div>
            </div>
          </div>
        </template>
      </UCard>
      <UCard class="col-span-3">
        <template #header>
          <div class="flex p-2 justify-between items-start p-2">
            <h2 class="text-center text-2xl font-bold">Заказы по услуги</h2>

            <ExportButton
              :column-labels="columnExportLabels"
              :name="`Пользователи записанные на услугу ${serviceFullInfo?.service.name}`"
              :data="serviceFullInfo?.ordersByService || [{}]"
            />
          </div>
        </template>
        <template #default>
          <UTable
            v-model:sorting="sorting"
            :data="serviceFullInfo?.ordersByService"
            ref="table"
            sticky
            v-model:pagination="pagination"
            :pagination-options="{
              getPaginationRowModel: getPaginationRowModel(),
            }"
            :loading="loading"
            loading-color="info"
            loading-animation="carousel"
            :columns="columns"
            v-model:global-filter="globalFilter"
            class="print-table"
          >
            <template #expanded="{ row }">
              <pre>{{ row.original }}</pre>
            </template>
          </UTable>
          <div
            class="flex justify-center border-t border-default pt-4 no-print"
          >
            <UPagination
              :default-page="
                (table?.tableApi?.getState().pagination.pageIndex || 0) + 1
              "
              :items-per-page="table?.tableApi?.getState().pagination.pageSize"
              :total="table?.tableApi?.getFilteredRowModel().rows.length"
              @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
              active-color="info"
            />
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<style>
@media print {
  .no-print {
    display: none !important;
  }

  .print-only {
    display: block !important;
  }

  /* General print styling */
  body {
    font-size: 12pt;
    color: #000;
    background: #fff;
  }

  .container {
    width: 100%;
    max-width: 100%;
    padding: 0;
    margin: 0;
  }

  /* Remove card shadows and borders for cleaner print */
  .u-card {
    box-shadow: none !important;
    border: 1px solid #ddd !important;
  }

  /* Ensure table fits on page */
  .print-table {
    width: 100%;
    page-break-inside: auto;
  }

  .print-table tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }

  /* Ensure status badges print with visible borders */
  .print-status {
    border: 1px solid #000 !important;
    color: #000 !important;
    background-color: transparent !important;
  }

  /* Add page breaks where needed */
  h3 {
    page-break-after: avoid;
  }

  /* Expand all content to be visible */
  .u-table {
    display: table !important;
  }

  /* Ensure all rows are visible without pagination */
  .u-table tbody tr {
    display: table-row !important;
  }

  /* Adjust font sizes for print */
  h2 {
    font-size: 18pt !important;
  }

  h3 {
    font-size: 16pt !important;
  }

  p {
    font-size: 12pt !important;
  }
  /* Hide header and footer when printing */
  header,
  .header,
  #header,
  footer,
  .footer,
  #footer,
  nav,
  .nav,
  #nav {
    display: none !important;
  }

  /* Hide any other navigation elements */
  .navigation,
  .navbar,
  .site-header,
  .site-footer,
  .menu,
  .sidebar {
    display: none !important;
  }

  /* Remove any fixed positioning that might cause elements to overlap printed content */
  .fixed-top,
  .fixed-bottom,
  .sticky-top,
  .sticky-bottom {
    position: static !important;
  }
}

/* Hide print-only elements when not printing */
.print-only {
  display: none;
}
</style>
