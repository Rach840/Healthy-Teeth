<script setup lang="ts">
definePageMeta({
  layout: ["admin"],
  middleware: ["admin"],
});

const config = useRuntimeConfig();
const { token, isAuthenticated } = useAuthStore();
const doctor = ref<Record<string, string | string[]> | null>(null);
const loading = ref(true);
const route = useRoute();
watchEffect(async () => {
  if (isAuthenticated) {
    const { data: doctorsResp, status } = await useFetch(
      `${config.public.apiUrl}/admin/doctors/${route.params.id}`,
      {
        method: "GET",
        headers: new Headers({
          "Authorization": "Bearer " + token,
        }),
      },
    );
    console.log(doctorsResp.value, status);
    doctor.value = doctorsResp.value;
    loading.value = false;
  }
});

// Функция для печати страницы
const printOrder = () => {
  window.print();
};
</script>

<template>
  <div class="no-print flex items-center gap-4 mb-6">
    <UButton
      variant="solid"
      color="info"
      icon="i-lucide-arrow-left"
      class="cursor-pointer"
      to="/admin/doctors"
      size="xl"
    >
      Вернутся к докторам
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
    <h1 class="text-2xl font-bold">Профиль доктора</h1>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 print-container">
    <div class="lg:col-span-1">
      <UCard class="mb-6">
        <template #header>
          <div class="p-6 flex flex-col items-center text-center">
            <div class="relative h-32 w-32 rounded-full overflow-hidden mb-4">
              <img
                :src="doctor?.image"
                :alt="doctor?.name"
                class="object-cover"
              />
            </div>
            <h2 class="text-2xl font-bold">
              {{
                doctor?.lastName +
                " " +
                doctor?.firstName +
                " " +
                doctor?.surName
              }}
            </h2>
            <p class="text-gray-600 text-lg mt-2">{{ doctor?.post }}</p>
          </div>
        </template>

        <div class="p-6 space-y-4">
          <div class="flex items-center gap-3">
            <UIcon
              size="18"
              name="i-lucide-mail"
            />
            <span class="text-lg">{{ doctor?.email }}</span>
          </div>
          <div class="flex items-center gap-3">
            <UIcon
              size="18"
              name="i-lucide-phone"
            />
            <span class="text-lg">{{ doctor?.phone }}</span>
          </div>
          <!--          <div class="flex items-center gap-3">-->
          <!--            <Calendar class="text-gray-400" size={18} />-->
          <!--            <span class="text-sm">Joined {doctor?.joinedDate}</span>-->
          <!--          </div>-->
        </div>
      </UCard>
    </div>

    <div class="lg:col-span-2">
      <UCard class="mb-6">
        <template #header>
          <div class="p-3">
            <h3 class="text-2xl font-semibold">Описание</h3>
          </div></template
        >

        <div class="p-6">
          <p class="text-gray-700 text-lg mb-6">{{ doctor?.description }}</p>

          <blockquote
            class="border-l-4 border-sky-600 pl-4 italic text-gray-600 mb-6"
          >
            {{ doctor?.quotes }}
          </blockquote>
        </div>
      </UCard>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UCard class="col-span-2">
          <template #header>
            <div class="p-3">
              <h3 class="text-2xl font-semibold">Образование и курсы</h3>
            </div>
          </template>

          <div class="p-3">
            <ul class="space-y-4">
              <li
                v-for="(educate, index) in doctor?.education"
                class="flex items-center"
              >
                <span
                  class="bg-sky-100 text-sky-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0"
                >
                  {{ index + 1 }}
                </span>
                <span class="text-xl">{{ educate }}</span>
              </li>
            </ul>
          </div>
        </UCard>
        <UCard class="col-span-2">
          <template #header>
            <div class="p-3">
              <h3 class="text-2xl font-semibold">Статистика</h3>
            </div>
          </template>

          <div class="p-4">
            <div class="grid grid-cols-3 gap-4">
              <div class="bg-sky-50 rounded-lg p-4 text-center">
                <p class="text-2xl font-bold text-sky-600">
                  {{ doctor?.ordersLastMonth }}
                </p>
                <p class="text-sm text-gray-600">Записи за последней месяц</p>
              </div>
              <div class="bg-purple-50 rounded-lg p-4 text-center">
                <p class="text-2xl font-bold text-purple-600">
                  {{ doctor?.ordersByDoctor.length }}
                </p>
                <p class="text-sm text-gray-600">Всего записей</p>
              </div>
              <div class="bg-amber-50 rounded-lg p-4 text-center">
                <p class="text-2xl font-bold text-amber-600">
                  {{ doctor?.experience }}
                </p>
                <p class="text-sm text-gray-600">Опыт</p>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Стили для печати */
@media print {
  /* Скрываем элементы, которые не нужны при печати */
  .no-print {
    display: none !important;
  }

  /* Убираем фоновые цвета и тени для экономии чернил */
  .bg-sky-50,
  .bg-purple-50,
  .bg-amber-50 {
    background-color: white !important;
    box-shadow: none !important;
    border: 1px solid #ddd;
  }

  /* Оптимизируем сетку для печати */
  .print-container {
    display: block !important;
  }

  /* Убираем отступы страницы */
  @page {
    margin: 1cm;
  }

  /* Убираем лишние отступы у карточек */
  .u-card {
    margin-bottom: 1rem !important;
    box-shadow: none !important;
    border: 1px solid #ddd !important;
  }

  /* Улучшаем читаемость текста */
  body {
    font-size: 12pt;
    color: black;
  }

  /* Обеспечиваем, чтобы изображения не выходили за пределы страницы */
  img {
    max-width: 100% !important;
  }

  /* Добавляем разрывы страниц в нужных местах */
  .lg\:col-span-2 {
    page-break-before: auto;
  }

  /* Убираем цвета ссылок и подчеркивание */
  a {
    color: black !important;
    text-decoration: none !important;
  }

  /* Улучшаем отображение блоков цитат */
  blockquote {
    border-left: 2px solid #000 !important;
    color: black !important;
  }
}
</style>
