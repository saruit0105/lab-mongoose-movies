const express = require("express");
const router = express.Router();
const Movie = require("../models/Movies");
const Character = require("../models/MovieCharacters");

router.get("/movies/", async (req, res, next) => {
  try {
    const movies = await Movie.find();
    if (req.session.currentUser) {
      movies.forEach(thisMovie => {
        if (
          thisMovie.added.equals(req.session.currentUser._id) ||
          req.session.currentUser.admin
        ) {
          thisMovie.isMine = true;
        }
      });
    }
    res.render("movie-views/AllMovies", { movies });
  } catch (err) {
    next(err);
  }
});

router.get("/movies/edit/:placeHolderID", async (req, res, next) => {
  try {
    const theMovie = await Movie.findById(req.params.placeHolderID);
    const allCharacters = await Character.find();
    allCharacters.forEach(thisCharacter => {
      if (thisCharacter._id.equals(theMovie.featured)) {
        thisCharacter.isTheCorrectCharacter = true;
      }
    });
    res.render("movie-views/Edit", { theMovie, allCharacters });
  } catch (err) {
    next(err);
  }
});

router.post("/movies/update/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    let update = { ...req.body };
    await Movie.findByIdAndUpdate(id, update, {
      new: true
    });
    res.redirect("/movies/" + id);
  } catch (err) {
    next(err);
  }
});

router.get("/movies/new", async (req, res, next) => {
  const allCharacters = await Character.find();
  await res.render("movie-views/new", { allCharacters });
});

router.post("/create-the-movie", async (req, res, next) => {
  try {
    const title = req.body.theNewTitle;
    const year = req.body.theNewYear;
    const featured = req.body.theNewFeatured;
    Movie.create({
      title: title,
      year: year,
      featured: featured,
      added: req.session.currentUser._id
    });
    await res.redirect("/");
  } catch (err) {
    next(err);
  }
});

router.get("/movies/:idOfMovie", async (req, res, next) => {
  try {
    const id = req.params.idOfMovie;
    const theMovie = await Movie.findById(id).populate("featured");
    console.log(theMovie.featured);
    res.render("movie-views/SingleMovie", { theMovie });
  } catch (err) {
    next(err);
  }
});

router.post("/movies/delete/:idOfMovie", async (req, res, next) => {
  try {
    await Movie.findByIdAndRemove(req.params.idOfMovie);
    res.redirect("/movies");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
