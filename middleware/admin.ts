export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return;
  const authStore = useAuthStore();
  onMounted(async () => {
    await authStore.checkAuth();
  });
  if (authStore?.user.role != "ADMIN") {
    return navigateTo("/");
  }
});
