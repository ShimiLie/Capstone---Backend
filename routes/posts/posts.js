const express = require("express");
const requireLogin = require("../../middleware/requireLogin");
const {
  createPost,
  getAllPosts,
  deletePost,
} = require("../../controllers/postController");
const postRouter = express.Router();

postRouter.post("/createpost", requireLogin, createPost);
postRouter.get("/allpost", requireLogin, getAllPosts);

//deletePosts
postRouter.delete("/deletepost/:postId", requireLogin, deletePost);

module.exports = postRouter;
