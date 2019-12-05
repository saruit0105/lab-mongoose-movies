const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const bcrypt = require("bcryptjs");

router.get("/users/signup", async (_, res, next) => {
  await res.render("user-views/signup");
});

router.post("/signup", async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const username = req.body.username;
    User.create({ username: username, password: hash });
    await res.redirect("/users/login");
  } catch (err) {
    next(err);
  }
});

router.get("/users/login", async (req, res, next) => {
  await res.render("user-views/login");
});

router.post("/users/login", async (req, res, next) => {
  try {
    const theUsername = req.body.username;
    const thePassword = req.body.password;
    const user = await User.findOne({ username: theUsername });
    if (!user) {
      alert("USER DOES NOT EXIST!");
      res.redirect("/users/login");
      return;
    }
    if (bcrypt.compareSync(thePassword, user.password)) {
      req.session.currentUser = user;
      res.redirect("/");
    } else {
      res.render("users-views/login", {
        errorMessage: "Incorrect password"
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
