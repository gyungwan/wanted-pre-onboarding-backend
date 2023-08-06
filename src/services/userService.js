import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
}

export async function findUserById(id) {
  return await prisma.user.findUnique({
    where: { id: id },
  });
}
