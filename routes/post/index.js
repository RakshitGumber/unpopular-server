import { Router } from "express";
import authenticate from "../../middleware/authenticate.js";
import {
  getPostsBySearch,
  updatePost,
  deletePost,
  likePost,
  getPosts,
  getPost,
  commentPost,
  createPost,
  dislikePost,
} from "../../controller/post.js";

const router = Router();

router
  .get("/", getPosts)
  .get("/search", getPostsBySearch)
  .post("/", createPost)
  .patch("/:id", updatePost)
  .delete("/:id", deletePost)
  .patch("/:id/like", likePost)
  .patch("/:id/dislike", dislikePost)
  .get("/:id", getPost)
  .post("/:id/comment", commentPost);

export default router;
