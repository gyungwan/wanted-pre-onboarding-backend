import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createBoard = async (title, content, userId) => {
  try {
    return await prisma.board.create({
      data: {
        title,
        content,
        userId,
      },
    });
  } catch (error) {
    throw new Error("게시글 생성 중 오류가 발생했습니다.");
  }
};

export const getAllBoards = async (offset, limit) => {
  return prisma.board.findMany({
    where: { deletedAt: null }, // Soft delete된 게시물 제외
    skip: offset,
    take: limit,
    orderBy: {
      createdAt: "desc", //최신순으로 정렬
    },
  });
};

export const getBoard = async (boardId) => {
  return await prisma.post.findUnique({
    where: {
      id: boardId,
    },
  });
};

export const updateBoardById = async (boardId, title, content, userId) => {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
  });

  if (!board) throw new Error("게시글을 찾을수 없습니다.");
  if (board.userId !== userId) throw new Error("게시글 수정 권한이 없습니다.");

  return await prisma.board.update({
    where: { id: boardId },
    data: { title, content },
  });
};

export const deleteBoardById = async (boardId, userId) => {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
  });

  if (!board) throw new Error("게시글을 찾을수 없습니다.");
  if (board.userId !== userId) throw new Error("게시글 삭제 권한이 없습니다. ");

  //soft delete 데이터를 실제로 삭제하는 대신 isDeleted를 true로 설정하고 deletedAt에 현재 날짜/시간 저장
  return await prisma.board.update({
    where: { id: boardId },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
};
