import express from "express";
import {
  createNewBoard,
  getBoards,
  getBoardById,
  updateBord,
  deleteBoard,
} from "../controllers/boardController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/create", authenticateToken, createNewBoard); //게시글 생성
router.get("/", getBoards); //게시글 목록 조회 페이지네이션
router.get("/:id", getBoardById); //특정 게시글 조회
router.put("/:id", authenticateToken, updateBord); // 게시글 수정
router.delete("/:id", authenticateToken, deleteBoard); // 게시글 삭제

export default router;
