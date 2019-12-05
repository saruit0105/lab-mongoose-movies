const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  title: String,
  year: String,
  featured: { type: Schema.Types.ObjectId, ref: "Character" },
  added: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
