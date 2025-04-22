export default defineAppConfig({
  ui: {
    card: {
      slots: {
        root: "rounded-lg",
        header: "p-2 sm:px-4",
        body: "p-2 sm:p-4",
        footer: "p-2 sm:px-4",
      },
    },
    colors: {
      primary: "blue",
      neutral: "zinc",
    },
  },
});
