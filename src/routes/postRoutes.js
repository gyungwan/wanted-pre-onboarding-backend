import express from "express";
import {
  createNewPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/create", authenticateToken, createNewPost); //게시글 생성
router.get("/", getPosts); //게시글 목록 조회 페이지네이션
router.get("/:id", getPostById); //특정 게시글 조회
router.put("/:id", authenticateToken, updatePost); // 게시글 수정
router.delete("/:id", authenticateToken, deletePost); // 게시글 삭제

export default router;
