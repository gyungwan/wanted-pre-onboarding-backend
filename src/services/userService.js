export const findUserByEmail = async (email, prismaInstance) => {
  return await prismaInstance.user.findUnique({
    where: {
      email: email,
    },
  });
};

export const findUserById = async (id, prismaInstance) => {
  return await prismaInstance.user.findUnique({
    where: { id: id },
  });
};
