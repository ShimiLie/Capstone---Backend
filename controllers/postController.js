const Post = require("../models/post");

exports.createPost = async (req, res) => {
  const { title, body, pic } = req.body;
  if (!title || !body || !pic) {
    return res.status(400).json({ msg: "Please input all fields" });
  }

  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    photo: pic,
  });
  post
    .save()
    .then((result) => {
      res.json({ result, msg: "Created Post Successfully" });
    })
    .catch((err) => {
      return res.status(500).son({ msg: err.message });
    });
};

exports.getAllPosts = async (req, res) => {
  await Post.find({})
    .populate("_id name pic")
    .sort("-createdAt")
    .then((posts) => {
      res.status(200).json({ posts });
    })
    .catch((err) => {
      res.status(500).json({ msg: err.message });
    });
};
