import prisma from "~/lib/prisma";
import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);
  console.log(email, password);
  const userExist = await prisma.users.findFirst({
    where: {
      email: email,
    },
  });
  if (!userExist) {
    return {
      succes: false,
      message: "Пользователя с такой электронной почтой не существует",
    };
  }
  const passwordCompare = await bcrypt.compare(password, userExist.password);
  if (passwordCompare) {
    await setUserSession(event, {
      user: {
        ...userExist,
      },
      secure: {
        apiToken: "1234567890",
      },

      loggedInAt: new Date(),
    });
    return { succes: true };
  }
  throw createError({
    statusCode: 401,
    message: "Bad credentials",
  });
});
