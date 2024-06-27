const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");

const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const Post = require("./models/post");
const { checkForAuthenticationCookie } = require("./middleware/auth");

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allPosts = await Post.find({});
  res.render("home", { user: req.user, posts: allPosts });
});

app.use("/post", postRouter);
app.use("/user", userRouter);

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
