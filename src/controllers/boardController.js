import { Prisma } from "@prisma/client";
import * as boardService from "../services/boardService.js";

export const createNewBoard = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  if (!userId) {
    return res
      .status(401)
      .json({ error: "로그인 후 게시글 작성이 가능합니다." });
  }
  const newBoard = await boardService.createBoard(title, content, userId);

  res.status(201).json(newBoard);
};

export const getBoards = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  const boards = await boardService.getAllBoards(offset, limit);

  res.status(200).json(boards);
};

export const getBoardById = async (req, res) => {
  const board = await boardService.getBoard(req.params.id);

  if (!board) {
    return res.status(404).send("게시글을 찾을 수 없습니다.");
  }

  res.status(200).json(board);
};

export const updateBoard = async (req, res) => {
  try {
    const { title, content } = req.body;
    const boardId = req.params.id;
    const userId = req.user.id;

    const updatedBoard = await boardService.updateBoardById(
      boardId,
      title,
      content,
      userId
    );
    if (!updatedBoard) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }
    return res.status(200).json(updatedBoard);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

export const deleteBoard = async (req, res) => {
  try {
    const boardId = req.params.id;
    const userId = req.user.id;

    const isDeleted = await boardService.deleteBoardById(boardId, userId);
    if (!isDeleted) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    res.status(200).send("게시글이 성공적으로 삭제되었습니다.");
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
