import { Prisma } from "@prisma/client";
import {
  createBoard,
  getAllBoards,
  getBoard,
  updateBoardById,
  deleteBoardById,
} from "../services/boardService.js";

export const createNewBoard = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  if (!userId) {
    return res
      .status(401)
      .json({ error: "로그인 후 게시글 작성이 가능합니다. " });
  }
  const newBoard = await createBoard(title, content, userId);

  res.status(201).json(newBoard);
};

export const getBoards = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  const boards = await getAllBoards(offset, limit);

  res.status(200).json(boards);
};

export const getBoardById = async (req, res) => {
  const board = await getBoard(req.params.id);

  if (!board) {
    return res.status(404).send("게시글을 찾을 수 없습니다.");
  }

  res.status(200).json(board);
};

export const updateBord = async (req, res) => {
  try {
    const { title, content } = req.body;
    const boardId = req.params.id;
    const userId = req.user.id;

    const updatedBoard = await updateBoardById(boardId, title, content, userId);
    res.status(200).json(updatedBoard);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteBoard = async (req, res) => {
  try {
    const boardId = req.params.id;
    const userId = req.user.id;

    await deleteBoardById(boardId, userId);
    res.status(200).send("게시글 삭제 하였습니다.");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
