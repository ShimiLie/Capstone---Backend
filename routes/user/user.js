const express = require("express");
const {
  logout,
  getMyPosts,
  updateProfile,
} = require("../../controllers/userController");
const userRouter = express.Router();
const requireLogin = require("../../middleware/requireLogin");

userRouter.get("/logout", requireLogin, logout);
userRouter.get("/mypost", requireLogin, getMyPosts);
userRouter.put("/updateProfile", requireLogin, updateProfile);

module.exports = userRouter;
