<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const store = useAuthStore();
const user = ref(null);
watchEffect(async () => {
  user.value = store.user;
});
console.log("headerUser", user);
async function logout() {
  await store.logout();
  await navigateTo("/login");
}
</script>

<template>
  <header
    class="flex bg-white items-center justify-between scroll-smooth px-10 py-4 shadow sticky t-0 z-50"
  >
    <div>
      <img
        class="h-18 w-36 object-cover"
        src="/logo4.png"
        alt="Logo"
      />
    </div>
    <nav class="flex items-center">
      <div class="flex items-center space-x-4">
        <NuxtLink
          class="underline text-lg"
          to="/"
          >О клинике</NuxtLink
        >
        <NuxtLink
          v-if="user?.role != 'ADMIN'"
          class="underline text-lg"
          to="/categories"
          >Услуги
        </NuxtLink>
        <NuxtLink
          class="underline text-lg"
          to="/doctors"
        >
          Врачи
        </NuxtLink>
        <NuxtLink
          v-if="user?.role != 'ADMIN'"
          class="underline text-lg"
          to="/contacts"
          >Контакты
        </NuxtLink>

        <NuxtLink
          v-if="user?.role == 'ADMIN'"
          class="underline text-lg"
          to="/admin/"
          >Админ панель
        </NuxtLink>

        <span class="font-bold text-black"> +7 (800) 985-80-45 </span>
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
        <UButton
          size="xl"
          color="info"
          class="cursor-pointer"
          >Перезвоните мне</UButton
        >
        <UButton
          size="xl"
          v-if="!user"
          variant="link"
          color="info"
          to="/login"
          class="cursor-pointer underline text-xl"
        >
          <img
            src="/user.png"
            class="w-[32px]"
            alt="User"
          />
          Войти
        </UButton>
        <UPopover v-if="user">
          <UButton
            size="xl"
            variant="link"
            color="info"
            class="cursor-pointer text-xl"
          >
            <img
              src="/user.png"
              class="w-[32px]"
              alt="User"
            />
            {{ user?.firstName }}
          </UButton>

          <template #content>
            <div class="flex flex-col">
              <UButton
                size="xl"
                variant="link"
                to="/profile"
                color="primary"
                class="cursor-pointer"
              >
                Профиль
              </UButton>
              <UButton
                size="xl"
                variant="link"
                color="primary"
                @click="logout"
                class="cursor-pointer"
              >
                Выйти
              </UButton>
            </div>
          </template>
        </UPopover>
      </div>
    </nav>
  </header>
</template>
