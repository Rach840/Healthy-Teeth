import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const {
    context: {
      params: { id },
    },
  } = event;
  console.log(id);
  const getCategory = await prisma.category.findFirst({
    where: {
      id: parseInt(id),
    },
  });
  const servicesByCategory = await prisma.services.findMany({
    where: {
      categoryName: getCategory?.name,
    },
  });

  return {
    ...getCategory,
    services: servicesByCategory,
  };
});
