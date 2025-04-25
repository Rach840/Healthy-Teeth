import bcrypt from "bcryptjs";
import prisma from "~/lib/prisma";
import { Users } from "~/prisma/generated/client";

export default defineEventHandler(async (event) => {
  const { user }: { user: Users } = await readBody(event);
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

  const password = await bcrypt.hash(user.password, 10);
  const userNew = await prisma.users.create({
    data: {
      ...user,
      password: password,
    },
  });
  return { succes: true };
});
