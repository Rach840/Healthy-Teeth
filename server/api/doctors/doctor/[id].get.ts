import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const {
    context: {
      params: { id },
    },
  } = event;
  console.log(id);
  const getDoctor = await prisma.doctors.findFirst({
    where: {
      id: parseInt(id),
    },
  });
  const servicesByDoctor = await prisma.services.findMany({
    where: {
      doctorId: getDoctor?.id,
    },
  });

  return {
    ...getDoctor,
    services: servicesByDoctor,
  };
});
