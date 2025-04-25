import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Получаем все категории
    const categories = await prisma.category.findMany();
    // Получаем все услуги
    const services = await prisma.services.findMany();
    // Преобразуем массив категорий, добавляя к ним услуги по фильтру
    const categoriesWithServices = categories.map((category) => {
      return {
        ...category, // Данные самой категории (картинка и название )
        services: services.filter((item) => item.categoryName == category.name), // Если у услуги название родительской категории такое же что и у текущей категории то добавить массив принадлежаших категории услуг
      };
    });
    // Возвращаем категории вместе с услугами принадлежих ему
    return categoriesWithServices;
  } catch (error) {
    console.error(error);
  }
});
