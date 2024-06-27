const express = require("express");
const multer = require("multer");
const path = require("path");

const Post = require("../models/post");
const Comment = require("../models/comment");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (res, file, cb) {
    cb(null, path.resolve("./public/uploads/"));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/add", (req, res) => {
  return res.render("addPost", { post: req.user });
});

router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );

  res.render("post-detail", { user: req.user, post, comments });
});

router.post("/comment/:postId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    postId: req.params.postId,
    createdBy: req.user._id,
  });

  return res.redirect(`post/${req.params.postId}`);
});

router.post("/", upload.single("postImageUrl"), async (req, res) => {
  const { title, description } = req.body;

  const post = await Post.create({
    title,
    description,
    createdBy: req.user?._id,
    postImageUrl: `/uploads/${req.file.filename}`,
  });

  return res.redirect(`post/${post._id}`);
});

module.exports = router;
