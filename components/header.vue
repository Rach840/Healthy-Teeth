<template>
  <header
    class="flex bg-white items-center justify-between scroll-smooth px-10 py-4 shadow sticky t-0 z-50"
  >
    <div>
      <img class="h-18 w-36 object-cover" src="/logo4.png" alt="Logo" />
    </div>
    <nav class="flex items-center">
      <div class="flex items-center space-x-4">
        <NuxtLink to="/">О клинике</NuxtLink>
        <NuxtLink to="/services">Услуги</NuxtLink>
        <NuxtLink to="/doctors">Врачи</NuxtLink>
        <NuxtLink to="/contacts">Контакты</NuxtLink>
        <span class="font-bold text-black"> +7 (800) 985-80-45 </span>
        <a href=""><Icon name="logos:whatsapp-icon" size="2rem" /></a>
        <a href=""><Icon name="lineicons:vk" size="2rem" /></a>
        <a href="https://t.me/escapefromtarkovRU"
          ><Icon name="logos:telegram" size="2rem"
        /></a>
        <UButton size="xl" color="secondary">Перезвоните мне</UButton>
        <!--        <button-->
        <!--          class="bg-blue-500 py-6 text-lg hover:bg-blue-600 duration-200 px-7"-->
        <!--        ></button>-->
        <img src="/user.png" class="w-[32px]" alt="User" />
        <a href="#">Войти</a>
      </div>
    </nav>
  </header>
</template>
