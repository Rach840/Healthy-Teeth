import { PrismaClient } from "~/prisma/generated/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

const { NODE_ENV } = process.env;
if (NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
