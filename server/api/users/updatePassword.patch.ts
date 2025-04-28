import bcrypt from "bcryptjs";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const {
    newPassword,
    currentPassword,
  }: { newPassword: string; currentPassword: string } = await readBody(event);
  const { user } = await requireUserSession(event);
  const passwordCompare = await bcrypt.compare(currentPassword, user?.password);
  console.log("passwordCompare", passwordCompare);
  if (!passwordCompare) {
    return { succes: false, message: "Пароль не верный" };
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 10);
  console.log(newPassword, newPasswordHash);
  await prisma.users.update({
    data: {
      password: newPasswordHash,
    },
    where: {
      id: user.id,
    },
  });

  await replaceUserSession(event, {
    user: { ...user, password: newPasswordHash },
  });
  return { succes: true };
});
