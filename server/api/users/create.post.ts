import { prisma } from "~/prisma/db";

export default defineEventHandler(async (event) => {
  const { user } = await readBody(event);
  console.log(user);
  const userExist = await prisma.users.findFirst({
    where: {
      email: user.email,
    },
  });
  if (userExist) {
    return {
      succes: false,
      message: "Пользователь с такой почтой уже существует",
    };
  }

  const userNew = await prisma.users.create({
    data: {
      ...user,
    },
  });
  return userNew;
});
