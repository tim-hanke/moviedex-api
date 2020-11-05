require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const moviedex = require("./movies-data-small.json");

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
  const authToken = req.get("Authorization");
  const apiToken = process.env.API_TOKEN;

  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unauthorized request" });
  }

  next();
});

function handleGetMovie(req, res) {
  const { genre, country, avg_vote } = req.query;
  let response = moviedex;

  if (genre) {
    response = response.filter((movie) =>
      movie.genre.toLowerCase().includes(genre.toLowerCase())
    );
  }

  if (country) {
    response = response.filter((movie) =>
      movie.country.toLowerCase().includes(country.toLowerCase())
    );
  }

  if (avg_vote && !isNaN(Number(avg_vote))) {
    response = response.filter(
      (movie) => Number(movie.avg_vote) >= Number(avg_vote)
    );
  }

  res.json(response);
}

app.get("/movie", handleGetMovie);

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`moviedex server listening at port ${PORT}`);
});
