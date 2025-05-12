export default defineNuxtRouteMiddleware(async () => {
  const accessToken = useCookie("accessToken");
  const store = useAuthStore();

  console.log("accesToken", accessToken.value);
  console.log(!accessToken.value && store.user);
  console.log(!store.user && accessToken.value);
  if (!accessToken.value) {
    console.log("no accessToken");
    try {
      await store.refresh();
    } catch {}
  } else {
    watchEffect(async () => {
      console.log("Authenticated user");
      await store.checkAuth();
    });
  }
});
