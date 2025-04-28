import prisma from "~/lib/prisma";
import type { UserUpdate } from "~/lib/types";

export default defineEventHandler(async (event) => {
  const { newInfo }: { newInfo: UserUpdate } = await readBody(event);
  const { user } = await requireUserSession(event);

  const newUser = await prisma.users.update({
    data: {
      ...newInfo,
    },
    where: {
      id: user.id,
    },
  });

  await replaceUserSession(event, {
    user: { ...newUser },
  });
  return { succes: true };
});
