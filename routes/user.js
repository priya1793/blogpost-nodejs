const express = require("express");
const User = require("../models/user");

const router = express.Router();

router.get("/login", (req, res) => {
  return res.render("login");
});

router.get("/register", (req, res) => {
  return res.render("register");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await User.comparePasswordAndCreateToken(email, password);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("login", {
      error: "Incorrect Email or Password",
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

router.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({
    fullName,
    email,
    password,
  });

  return res.redirect("/");
});

module.exports = router;
