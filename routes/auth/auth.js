const express = require("express");
const {
  register,
  login,
  resetPassword,
} = require("../../controllers/authController");
const authRouter = express.Router();

authRouter.post("/signup", register);
authRouter.post("/signin", login); //add signinController
authRouter.post("/reset-password", resetPassword);
authRouter.post("/new-password", (req, res) => {});

authRouter.post("/refresh-token");
authRouter.get("/logout", (req, res) => {});

module.exports = authRouter;
