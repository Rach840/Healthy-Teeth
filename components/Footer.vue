<template>
  <footer class="bg-[#f2f2f2] text-[#333] py-5">
    <div class="flex container mx-auto gap-10 items-start">
      <div class="flex flex-col justify-start items-start gap-4">
        <img
          class="h-40"
          src="/logo4.png"
          alt="Logo"
        />
        <h1 class="text-2xl text-[#333] bottom-6 font-bold">Контакты</h1>
        <span class="text-xl text-[#333] bottom-2.5">
          <span class="text-xl text-[#333] bottom-2.5 font-bold" />
          <span class="font-bold">Адрес:</span> г. Москва, Зеленый проспект, дом
          10, ГАУЗ города Москвы
        </span>

        <span class="text-xl text-[#333] bottom-2.5">
          <span class="font-bold">Телефон:</span>
          <a
            href="tel:+78009858045"
            class="underline"
            >+7 (800) 985-80-45</a
          >
        </span>
        <span class="text-xl text-[#333] bottom-2.5">
          <span class="font-bold">Электронная почта:</span> sp22@zdrav.mos.ru
        </span>
        <span class="text-xl text-[#333] bottom-2.5">
          <span class="font-bold">Время работы:</span> 8:00 – 17:00
        </span>
      </div>

      <div class="flex flex-col gap-4 ml-auto mt-15">
        <div class="flex items-center">
          <Icon
            name="carbon:phone-voice"
            size="2rem"
          />
          <span class="font-bold text-xl ml-2">
            <a
              href="tel:+78009858045"
              class="underline"
              >+7 (800) 985-80-45</a
            >
          </span>
        </div>

        <UButton
          size="xl"
          color="info"
          class="cursor-pointer px-9 py-6 text-xl"
          >Перезвоните мне</UButton
        >

        <span class="font-bold text-xl">Мы в социальных сетях</span>
        <div class="flex items-center gap-3 self-center">
          <a href=""
            ><Icon
              name="logos:whatsapp-icon"
              size="2rem"
          /></a>
          <a href=""
            ><Icon
              name="lineicons:vk"
              size="2rem"
          /></a>
          <a href="https://t.me/escapefromtarkovRU"
            ><Icon
              name="logos:telegram"
              size="2rem"
          /></a>
        </div>
      </div>
    </div>
    <div class="w-full h-[400px]">
      <h3 class="text-4xl font-bold mb-5 my-6 text-center">Наша локация</h3>

      <div class="w-full h-[400px]">
        <div class="relative overflow-hidden">
          <a
            href="https://yandex.eu/maps/213/moscow/?utm_medium=mapframe&utm_source=maps"
            class="inset-0 absolute text-sm text-[#eee]"
          >
          </a>
          <a
            class="top-6 absolute text-sm text-[#eee]"
            href="https://yandex.eu/maps/213/moscow/?from=mapframe&ll=37.780605%2C55.749548&mode=usermaps&source=mapframe&um=constructor%3A1e6d2560b8e37a2f517c1cdcd902ee317c3bc43aa8c46a0e5f6804b16ab85acf&utm_medium=mapframe&utm_source=maps&z=16.8"
          >
            Яндекс&nbsp;Карты — транспорт, навигация, поиск мест
          </a>
          <iframe
            src="https://yandex.com/map-widget/v1/?from=mapframe&ll=37.780605%2C55.749548&mode=usermaps&source=mapframe&um=constructor%3A1e6d2560b8e37a2f517c1cdcd902ee317c3bc43aa8c46a0e5f6804b16ab85acf&utm_source=mapframe&z=16.8"
            width="100%"
            height="400"
            :frameBorder="1"
            class="relative"
          />
        </div>
        <div class="text-center text-sm text-[#333] mt-6 border-t pt-4">
          © 2025 частная стоматологическая клиника «Healthy Teeth». Все права
          защищены.
        </div>
      </div>
    </div>
  </footer>
</template>
