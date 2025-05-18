<script setup lang="ts">
import type { orderFullInfo, OrdersTable, User } from "~/lib/types";
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import { type Column, getPaginationRowModel } from "@tanstack/vue-table";
import {
  getHeaderButtonProps,
  getHeaderDropDownProps,
  sorting,
} from "~/lib/getHeader";

definePageMeta({
  layout: ["admin"],
  middleware: ["admin"],
});
const table = useTemplateRef("table");
const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");
const config = useRuntimeConfig();

const UDropdownMenu = resolveComponent("UDropdownMenu");
const { token, isAuthenticated } = useAuthStore();
const order = ref<orderFullInfo | null>(null);
const loading = ref(true);
const route = useRoute();
const router = useRouter();
const toast = useToast();
watchEffect(async () => {
  if (isAuthenticated) {
    const { data: ordersResp, status } = await useFetch(
      `${config.public.apiUrl}/admin/orders/${route.params.id}`,
      {
        method: "GET",
        headers: new Headers({
          "Authorization": "Bearer " + token,
        }),
      },
    );
    console.log(ordersResp.value, status);
    order.value = ordersResp.value;
    loading.value = false;
  }
});
const orderDate = computed(() => {
  return new Date(order.value?.date).toLocaleString("ru-RU", {
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
    accessorKey: "serviceName",
    header: ({ column }) => getHeader(column, columnLabels["serviceName"]),
  },
  {
    accessorKey: "doctorFullName",
    header: ({ column }) => getHeader(column, columnLabels["serviceName"]),
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
  {
    accessorKey: "price",
    header: ({ column }) => getHeader(column, columnLabels["price"]),
    cell: ({ row }) => {
      return row.getValue("price") ? `${row.getValue("price")} ₽` : "Бесплатно";
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
async function deleteOrder() {
  await useFetch(
    `${config.public.apiUrl}/admin/orders/delete/${order?.value?.id}`,
    {
      method: "DELETE",
      headers: new Headers({
        "Authorization": `Bearer ${token}`,
      }),
    },
  );
  openModal.value = false;
  toast.add({
    title: "Заявка удалена",
    color: "success",
    icon: "i-lucide-check",
  });
  setTimeout(() => {
    router.replace("/admin/orders");
  }, 5000);
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="no-print flex justify-between items-center mb-6">
      <UButton
        variant="solid"
        color="info"
        icon="i-lucide-arrow-left"
        class="cursor-pointer"
        to="/admin/orders"
        size="xl"
      >
        Вернутся к заявкам
      </UButton>
      <UModal v-model:open="openModal">
        <UButton
          variant="solid"
          color="error"
          icon="i-lucide-trash"
          class="cursor-pointer"
          size="xl"
        >
          Удалить
        </UButton>
        <template #body>
          <div class="p-8">
            <h4 class="text-2xl">Вы точно хотите удалить запись?</h4>
          </div>
        </template>
        <template #footer>
          <div class="flex items-center space-x-4">
            <UButton
              label="Закрыть"
              color="neutral"
              class="cursor-pointer"
              variant="outline"
              @click="openModal = false"
            />
            <UButton
              variant="solid"
              color="error"
              @click="deleteOrder"
              icon="i-lucide-trash"
              class="cursor-pointer"
            >
              Удалить
            </UButton>
          </div>
        </template>
      </UModal>
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

    <UCard>
      <template #header>
        <div class="flex justify-between items-center flex-wrap">
          <h2 class="text-3xl">Запись номер - №{{ order?.id }}</h2>
          <h2 class="text-3xl">Дата и время - {{ orderDate }}</h2>
          <UBadge
            :color="order?.status == 'PROVIDED' ? 'success' : 'neutral'"
            size="xl"
            class="capitalize print-status"
            variant="subtle"
          >
            {{ order?.status == "PROVIDED" ? "Оказана" : "Ожидает" }}
          </UBadge>
        </div>
      </template>
      <template #default>
        <div class="space-y-8 py-2">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-3">
              <h3 class="text-2xl font-semibold mb-2">
                Информация о пользователе
              </h3>
              <p class="text-lg">
                ФИО -
                <span class="font-bold">
                  {{ order?.user?.lastName }} {{ order?.user?.firstName }}
                  {{ order?.user?.surName }}
                </span>
              </p>
              <p class="text-lg">
                Электронная почта -
                <span class="font-bold">{{ order?.user?.email }}</span>
              </p>
              <p class="text-lg">
                Номер телефона -
                <span class="font-bold"> +{{ order?.user?.phone }} </span>
              </p>
              <p class="text-lg">
                Снилс -
                <span class="font-bold">{{ order?.user?.snils }}</span>
              </p>

              <p class="text-lg">
                Пол -
                <span class="font-bold">{{
                  order?.user?.gender == "MALE" ? "Мужчина" : "Женщина"
                }}</span>
              </p>
              <p class="text-lg">
                Дата рождения -
                <span class="font-bold">{{
                  new Date(order?.user?.birth).toLocaleString("ru-RU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour12: false,
                  })
                }}</span>
              </p>
            </div>
            <div class="space-y-3">
              <div class="space-y-1">
                <h3 class="text-xl md:text-2xl font-semibold mb-2">
                  Информация о услуги
                </h3>
                <p class="text-lg">
                  Название -
                  <span class="font-bold">
                    {{ order?.service?.name }}
                  </span>
                </p>
                <p class="text-lg">
                  Категория -
                  <span class="font-bold">{{
                    order?.service?.categoryName
                  }}</span>
                </p>
                <p class="text-lg">
                  Стоимость -
                  <span class="font-bold"
                    >{{ order?.service?.price }} рублей</span
                  >
                </p>
              </div>
              <div class="space-y-1">
                <h3 class="text-xl md:text-2xl font-semibold mb-2">
                  Информация о докторе
                </h3>
                <p class="text-lg">
                  ФИО -
                  <span class="font-bold">
                    {{ order?.doctor?.lastName }} {{ order?.doctor?.firstName }}
                    {{ order?.doctor?.surName }}
                  </span>
                </p>
                <p class="text-lg">
                  Должность -
                  <span class="font-bold">{{ order?.doctor?.post }}</span>
                </p>
                <p class="text-lg">
                  Опыт -
                  <span class="font-bold">{{ order?.doctor?.experience }}</span>
                </p>
                <p class="text-lg">
                  Электронная почта -
                  <span class="font-bold"> {{ order?.doctor?.email }} </span>
                </p>
              </div>
            </div>
          </div>
          <div class="">
            <h3 class="text-2xl font-semibold mb-4">
              Другие записи пользователя
            </h3>

            <UTable
              v-model:sorting="sorting"
              :data="order?.userOtherOrders"
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
                :items-per-page="
                  table?.tableApi?.getState().pagination.pageSize
                "
                :total="table?.tableApi?.getFilteredRowModel().rows.length"
                @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
                active-color="info"
              />
            </div>
          </div>
        </div>
      </template>
    </UCard>
  </div>
</template>

<style>
/* Print-specific styles */
@media print {
  /* Hide elements not needed for printing */
  .no-print {
    display: none !important;
  }

  /* Show elements only for printing */
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
