import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
};

export const findUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id: id },
  });
};
