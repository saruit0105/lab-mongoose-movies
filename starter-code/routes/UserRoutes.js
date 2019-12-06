const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const bcrypt = require("bcryptjs");

router.get("/users/signup", async (_, res) => res.render("user-views/signup"));

router.post("/signup", async (req, res, next) => {
  try {
    const { body } = req;
    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(body.password, salt);
    const username = body.username;
    User.create({ username, password });
    await res.redirect("/users/login");
  } catch (err) {
    next(err);
  }
});

router.get("/users/login", async (req, res) => {
  const { error } = req.query;
  await res.render("user-views/login", {
    errorMessage: error
  });
});

router.post("/users/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const redirectURL = "/users/login";
    const user = await User.findOne({ username });
    if (!user) return res.redirect(redirectURL + "?error=Invalid user");
    const isAuthenticated = bcrypt.compareSync(password, user.password || "");
    if (!isAuthenticated)
      return res.redirect(redirectURL + "?error=Incorrect password");
    req.session.currentUser = user;
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
