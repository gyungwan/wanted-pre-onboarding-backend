import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createPost = async (title, content, userId) => {
  return await prisma.post.create({
    data: {
      title,
      content,
      userId,
    },
  });
};

export const getAllPosts = async (offset, limit) => {
  return prisma.post.findMany({
    where: { deletedAt: null }, // Soft delete된 게시물 제외
    skip: offset,
    take: limit,
    orderBy: {
      createdAt: "desc", //최신순으로 정렬
    },
  });
};

export const getPost = async (postId) => {
  return await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });
};

export const updatePostById = async (postId, title, content, userId) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) throw new Error("게시글을 찾을수 없습니다.");
  if (post.userId !== userId) throw new Error("게시글 수정 권한이 없습니다.");

  return await prisma.post.update({
    where: { id: postId },
    data: { title, content },
  });
};

export const deletePostById = async (postId, userId) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) throw new Error("게시글을 찾을수 없습니다.");
  if (post.userId !== userId) throw new Error("게시글 삭제 권한이 없습니다. ");

  //soft delete 데이터를 실제로 삭제하는 대신 isDeleted를 true로 설정하고 deletedAt에 현재 날짜/시간 저장
  return await prisma.post.update({
    where: { id: postId },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
};
