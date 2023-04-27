const Post = require("../models/post");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

module.exports.logout = async (req, res) => {
  try {
    res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
    return res.json({ msg: "Logout Success" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports.getMyPosts = async (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((posts) => {
      res.json({ posts: posts });
    })
    .catch((err) => {
      res.status(500).json({ msg: err.message });
    });
};

module.exports.updateProfile = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  await User.findOneAndUpdate(
    { _id: req.user },
    {
      name,
      email,
      password: hashedPassword,
    },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({ msg: err.message });
    } else {
      res.json({ msg: "Update Success" });
    }
  });
};
