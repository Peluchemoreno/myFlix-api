const express = require("express"),
  morgan = require("morgan"),
  fs = require("fs"),
  path = require("path"),
  bodyParser = require("body-parser"),
  uuid = require("uuid");
// imports for mongoose
const mongoose = require("mongoose");
const Models = require("./models");
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://localhost:27017/cfDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.json());
app.use(express.static("public"));

const auth = require("./auth")(app); // this 'app' passed into the function call ensures that Express is available in my auth.js file as well
const passport = require("passport");
require("./passport");

app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.find()
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        console.error(`Error: ${err}`);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.find({ Title: req.params.title })
      .then((movie) => {
        res.status(200).json(movie);
      })
      .catch((err) => {
        console.error(`Error: ${err}`);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

app.get(
  "/genres/:name",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ "Genre.Name": req.params.name })
      .then((movie) => {
        if (!movie) {
          res
            .status(400)
            .send("Sorry there are no genres with that name in the database");
        }
        res.status(200).json(movie.Genre);
      })
      .catch((err) => {
        console.error(`Error: ${err}`);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

app.get(
  "/directors/:name",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ "Director.Name": req.params.name })
      .then((movie) => {
        res.status(200).json(movie.Director);
      })
      .catch((err) => {
        console.error(`Error: ${err}`);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

app.post("/users", async (req, res) => {
  const { username, password, email, birthday } = req.body;
  await Users.findOne({ username })
    .then((user) => {
      if (user) {
        res.status(400).send(`The username ${username} is already taken`);
      } else {
        Users.create({
          username,
          password,
          email,
          birthday,
          FavoriteMovies: [],
        }).then((user) => {
          res.status(201).json(user);
        });
      }
    })
    .catch((err) => {
      console.error(`Error: ${err}`);
      res.status(500).send(`Error: ${err}`);
    });
});

app.put(
  "/users/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { username, password, email, birthday } = req.body;
    await Users.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          username,
          password,
          email,
          birthday,
        },
      },
      { new: true }
    )
      .then((updatedUser) => {
        res.status(200).json(updatedUser);
      })
      .catch((err) => {
        console.error(`Error: ${err}`);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

app.post(
  "/users/:id/movies/:movieTitle",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id, movieTitle } = req.params;
    let movieId;

    await Movies.findOne({ Title: movieTitle })
      .then((movie) => {
        movieId = movie._id;
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });

    await Users.findOneAndUpdate(
      { _id: id },
      { $push: { favoriteMovies: movieId } },
      { new: true }
    )
      .then((updatedUser) => {
        res
          .status(200)
          .send(
            `${movieTitle} was added to ${updatedUser.username}'s favorites list`
          );
      })
      .catch((err) => {
        console.error(`Error: ${err}`);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

app.delete(
  "/users/:id/movies/:movieTitle",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id, movieTitle } = req.params;
    let movieToRemoveId;

    await Movies.findOne({ Title: movieTitle })
      .then((movie) => {
        movieToRemoveId = movie._id;
      })
      .catch((err) => {
        console.error(`Error: ${err}`);
        res.status(500).send(`Error: ${err}`);
      });

    await Users.findOneAndUpdate(
      { _id: id },
      {
        $pull: {
          favoriteMovies: movieToRemoveId,
        },
      },
      { new: true }
    )
      .then((updatedUser) => {
        res
          .status(200)
          .send(
            `${movieTitle} was removed from ${updatedUser.username}'s favorites list`
          );
      })
      .catch((err) => {
        console.error(`Error: ${err}`);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

app.delete(
  "/users/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id } = req.params;
    await Users.findOneAndDelete({ _id: id })
      .then((user) => {
        if (!user) {
          res.status(400).send(`User was not found`);
        } else {
          res
            .status(200)
            .send(`User ${user.username} was successfully deleted`);
        }
      })
      .catch((err) => {
        console.error(`Error: ${err}`);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Houston, we have a problem!");
});

console.log("🥳 Success! App running on port 9090");
app.listen(9090);
