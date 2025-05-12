export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return;
  const authStore = useAuthStore();
  onMounted(async () => {
    await authStore.checkAuth();
  });

  // If user is authenticated and trying to access auth pages (login/register)
  if (authStore.user) {
    return navigateTo("/");
  }
});
