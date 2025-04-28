<script lang="ts" setup>
import type { AccordionItem } from "@nuxt/ui";

const { data: categories, status } = await useFetch("/api/category");
const mockAdvantages = [
  {
    image: "/забота.png",
    title: "Современное оборудование",
    description:
      "Стоматологическая клиника оснащена передовым оборудованием и использует инновационные методики лечения зубов, что позволяет проводить процедуры быстро, эффективно и безболезненно для пациентов",
  },
  {
    image: "/Опытные специалисты.png",
    title: "Опытные специалисты",
    description:
      " В клинике работаютвысококвалифицированные стоматологи, имеющие большой опыт работы и постоянно совершенствующие свои навыки. Они обеспечивают индивидуальный подход к каждому пациент",
  },
  {
    image: "/Комфортные условия.png",
    title: "Комфортные условия",
    description:
      "Стоматологическая клиника предлагает удобные кабинеты с современным дизайном, приятной атмосферой и качественным освещением. Пациенты могут расслабиться и чувствовать себя комфортно во время лечения",
  },
];
const items = ref<AccordionItem[]>([
  {
    title: "Как записываться на приём?",
    content: "Вы можете записаться онлайн или позвонить по нашему телефону.",
  },
  {
    title: "Какие способы оплаты вы принимаете?",
    content: "Принимаем наличные, карты и безналичные переводы.",
  },
  {
    title: "Как долго длится процедура имплантации?",
    content: "Обычно имплантация занимает от 1 до 3 часов.",
  },
  {
    title: "Можно ли отбелить зубы без вреда?",

    content: "Да, мы используем безопасные методы отбеливания.",
  },
]);
</script>
<template>
  <main>
    <section
      class="w-full h-[600px] bg-cover bg-center flex items-center justify-center bg-[url('/Glav2.png')]"
    >
      <div class="bg-black/50 p-8 rounded text-center text-white max-w-2xl">
        <h2 class="text-4xl font-bold mb-4">Стоматологическая клиника</h2>
        <p class="text-xl mb-6">
          Здоровье вашей улыбки — наша забота и профессионализм
        </p>
        <UButton
          to="/categories"
          class="py-6 px-6 text-2xl"
          size="xl"
          color="info"
          >Перезвоните мне</UButton
        >
        <!--        <button-->
        <!--          class="bg-blue-500 py-6 px-7 text-lg hover:bg-blue-600 duration-500 self-end"-->
        <!--        >-->
        <!--          Перейти к услугам-->
        <!--        </button>-->
      </div>
    </section>

    <section class="py-12 bg-white max-w-7xl mx-auto px-6">
      <h2 class="text-4xl font-bold text-center mb-10">О клинике</h2>

      <div class="flex flex-col md:flex-row items-start gap-10">
        <div class="w-full md:w-3/12 flex flex-col items-center">
          <div class="director w-full">
            <img
              class="w-full"
              src="/director.png"
              alt="director"
            />
          </div>

          <h3 class="font-bold text-2xl text-center mt-4">
            Григорий Вячеслав Анатольевич
          </h3>
          <h4 class="text-lg text-gray-700">Генеральный директор</h4>
        </div>

        <div class="w-full md:w-9/12">
          <h3 class="text-3xl font-bold mb-4">
            Описание клиники «Healthy Teeth»
          </h3>
          <p class="mb-4 text-lg">
            Добро пожаловать в частную стоматологическую клинику «Healthy
            Teeth»! Наша клиника предлагает широкий спектр стоматологических
            услуг для всей семьи в уютной и дружелюбной атмосфере. Мы стремимся
            обеспечить высокое качество лечения и заботу о каждом пациенте.
          </p>
          <p class="mb-4 text-lg">
            В «Healthy Teeth» работают опытные специалисты, которые используют
            современные технологии и методы для диагностики и лечения. Мы
            предлагаем профилактические осмотры, лечение кариеса,
            профессиональную гигиену полости рта, ортодонтию и эстетическую
            стоматологию.
          </p>
          <p class="text-lg">
            Наша цель — помочь вам сохранить здоровье и красоту вашей улыбки на
            долгие годы. Мы понимаем, как важно чувствовать себя комфортно во
            время посещения стоматолога, поэтому создаем максимально приятные
            условия для наших пациентов.
          </p>
        </div>
      </div>
    </section>
    <section class="py-8 bg-white container mx-auto relative px-6">
      <h2 class="text-4xl font-bold text-center mb-10">Услуги</h2>
      <div
        class="lg:py-8 lg:px-24 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-center text-black"
      >
        <CardCategory
          v-if="status === 'success'"
          v-for="category in categories.slice(0, 3)"
        >
          <template #image>
            <img
              :src="category.image"
              alt=""
            />
          </template>
          <template #categoryTitle>{{ category.name }}</template>
          <template #servicesList>
            <li
              class="text-xl"
              v-for="service in category.services"
            >
              {{ service.name }}
            </li>
          </template>
        </CardCategory>
      </div>
      <UButton
        class="relative cursor-pointer left-5/6"
        trailing-icon="i-lucide-arrow-right"
        color="info"
        to="/categories"
        size="xl"
        >Перейти к услугам</UButton
      >
    </section>
    <section class="py-8 container mx-auto">
      <h2 class="text-4xl font-bold text-center mb-10">Почему выбирают нас!</h2>

      <UCard class="bg-blue-200 w-1/2 mx-auto p-12">
        <template #default>
          <h3 class="text-xl font-bold text-center mb-4">
            В НАШЕЙ СТОМАТОЛОГИИ СОЧЕТАЮТСЯ СОВРЕМЕННОЕ ОБОРУДОВАНИЕ,
            КВАЛИФИЦИРОВАННЫЕ СПЕЦИАЛИСТЫ И ИНДИВИДУАЛЬНЫЙ ПОДХОД
          </h3>
        </template>
      </UCard>
    </section>
    <UContainer class="space-y-12 py-8 container mx-auto">
      <h2 class="text-3xl font-bold text-center mb-10">
        ПОЧЕМУ ВЫБИРАЮТ ИМЕННО НАС
      </h2>
      <div class="gap columns-3">
        <UCard v-for="advantages in mockAdvantages">
          <template #header>
            <div class="space-y-4">
              <img
                :src="advantages.image"
                alt=""
                class="mx-auto size-1/2"
              />
              <h3 class="text-xl text-center">{{ advantages.title }}</h3>
            </div>
          </template>
          <template #default>
            <p class="text-lg font-bold text-center mb-4">
              {{ advantages.description }}
            </p>
          </template>
        </UCard>
      </div>
    </UContainer>
    <UContainer class="space-y-12 py-8 container mx-auto">
      <h2 class="text-4xl font-bold text-center mb-10">Вопросы и ответы</h2>
      <UAccordion :items="items">
        <template #leading="{ item }">
          <h3 class="text-xl font-bold">{{ item.title }}</h3>
        </template>
        <template #content="{ item }">
          <div class="p-4">
            <p class="text-lg">{{ item.content }}</p>
          </div>
        </template>
      </UAccordion>
    </UContainer>
  </main>
</template>
