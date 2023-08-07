import { Prisma } from "@prisma/client";
import {
  createPost,
  getAllPosts,
  getPost,
  updatePostById,
  deletePostById,
} from "../services/postService.js";

export const createNewPost = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  if (!userId) {
    return res
      .status(401)
      .json({ error: "로그인 후 게시글 작성이 가능합니다. " });
  }
  const newPost = await createPost(title, content, userId);

  res.status(201).json(newPost);
};

export const getPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  const posts = await getAllPosts(offset, limit);

  res.status(200).json(posts);
};

export const getPostById = async (req, res) => {
  const post = await getPost(req.params.id);

  if (!post) {
    return res.status(404).send("게시글을 찾을 수 없습니다.");
  }

  res.status(200).json(post);
};

export const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const postId = req.params.id;
    const userId = req.user.id;

    const updatedPost = await updatePostById(postId, title, content, userId);
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    await deletePostById(postId, userId);
    res.status(200).send("게시글 삭제 하였습니다.");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
