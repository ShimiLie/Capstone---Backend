const express = require("express");
const requireLogin = require("../../middleware/requireLogin");
const { createPost, getAllPosts } = require("../../controllers/postController");
const postRouter = express.Router();

postRouter.post("/createpost", requireLogin, createPost);
postRouter.get("/allpost", requireLogin, getAllPosts);

module.exports = postRouter;
