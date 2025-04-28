import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Получаем все категории
    const doctors = await prisma.doctors.findMany();
    // Получаем все услуги
    const services = await prisma.services.findMany();
    console.log(services);
    // Преобразуем массив категорий, добавляя к ним услуги по фильтру
    return doctors.map((category) => {
      return {
        ...category, // Данные самой категории (картинка и название )
        services: services.filter((item) => item.doctorId == category.id), // Если у услуги название родительской категории такое же что и у текущей категории то добавить массив принадлежаших категории услуг
      };
    });
  } catch (error) {
    console.error(error);
  }
});
