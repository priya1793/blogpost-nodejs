const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const postRouter = require("./routes/post");
const Post = require("./models/post");

const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("connected to mongodb");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDb disconnected");
});

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: "desc" });
  res.render("posts/index", { posts: posts });
});

app.use("/posts", postRouter);

app.listen(5000, () => {
  connect();
  console.timeLog("Connected to backend");
});
