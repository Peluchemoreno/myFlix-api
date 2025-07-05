const express = require("express"),
  morgan = require("morgan"),
  fs = require("fs"),
  path = require("path"),
  bodyParser = require("body-parser");
uuid = require("uuid");

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.json());
app.use(express.static("public"));

let users = [
  {
    id: 1,
    name: "justinm",
    favoriteMovies: [],
  },
  {
    id: 2,
    name: "justinm2",
    favoriteMovies: [],
  },
];

const movieArray = [
  {
    title: "Chronicle",
    description:
      "Three high school friends gain superpowers after making an incredible discovery underground. Soon they find their lives spinning out of control.",
    genre: {
      name: "sci‑fi",
      description:
        "Stories rooted in speculative science, futuristic technology, or unexplored possibilities.",
    },
    imageURL:
      "https://m.media-amazon.com/images/M/MV5BMjE0NzY4NjE2Nl5BMl5BanBnXkFtZTcwMjUxNTQyNA@@._V1_.jpg",
    director: {
      name: "Josh Trank",
      bio: "American filmmaker known for his found-footage sci-fi debut Chronicle (2012), later directed Fantastic Four (2015) and Capone (2020).",
      birthYear: 1984,
      deathYear: null,
    },
    featured: false,
  },
  {
    title: "Jumper",
    description:
      "A young man with teleportation abilities suddenly finds himself in the middle of an ancient war between those like him and their sworn annihilators.",
    genre: {
      name: "sci‑fi",
      description:
        "Stories rooted in speculative science, futuristic technology, or unexplored possibilities.",
    },
    imageURL:
      "https://m.media-amazon.com/images/M/MV5BMTU5NDQxNzgwOF5BMl5BanBnXkFtZTcwNjY3NTcyMg@@._V1_.jpg",
    director: {
      name: "Doug Liman",
      bio: "American director/producer known for Swingers (1996), The Bourne Identity (2002), and Jumper (2008).",
      birthYear: 1965,
      deathYear: null,
    },
    featured: false,
  },
  {
    title: "Spider-Man",
    description:
      "After being bitten by a genetically‑modified spider, a shy teenager gains spider‑like abilities that he uses to fight injustice as a masked superhero.",
    genre: {
      name: "sci‑fi",
      description:
        "Stories rooted in speculative science, futuristic technology, or unexplored possibilities.",
    },
    imageURL:
      "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MGEtYmNjMi00Y2EzLTg0YTUtZjQwOTlhNWM2ZTY3XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
    director: {
      name: "Sam Raimi",
      bio: "American filmmaker famous for reinventing horror with The Evil Dead and directing the original Spider‑Man trilogy.",
      birthYear: 1959,
      deathYear: null,
    },
    featured: false,
  },
  {
    title: "Monsters, Inc.",
    description:
      "Monsters generate their city's power by scaring children, but they are terribly afraid themselves of being contaminated by children.",
    genre: {
      name: "buddy comedy",
      description:
        "Films focused on the friendship and comedic dynamic between two or more main characters.",
    },
    imageURL:
      "https://m.media-amazon.com/images/M/MV5BMjA0Njg4NzYxNF5BMl5BanBnXkFtZTYwNzE0MjM2._V1_.jpg",
    director: {
      name: "Pete Docter",
      bio: "American animator/director and Pixar creative force behind Monsters, Inc., Up (2009), and Inside Out (2015).",
      birthYear: 1968,
      deathYear: null,
    },
    featured: false,
  },
  {
    title: "Silent Night",
    description:
      "A grieving father enacts his long-awaited revenge against a ruthless gang on Christmas Eve.",
    genre: {
      name: "tragedy",
      description:
        "Stories centered on human suffering, loss, or downfall, often driven by fate or character flaws.",
    },
    imageURL:
      "https://m.media-amazon.com/images/M/MV5BZTliY2E3NjgtYmRkOC00ZWU4LTgyOTA0NTZhMDVjNWIxXkEyXkFqcGdeQXVyMTY5MDEyNzI@._V1_.jpg",
    director: {
      name: "John Woo",
      bio: "Hong Kong‑born filmmaker famed for stylized, operatic action movies like A Better Tomorrow (1986) and Hard Boiled (1992).",
      birthYear: 1946,
      deathYear: null,
    },
    featured: false,
  },
  {
    title: "Godzilla x Kong: The New Empire",
    description:
      "Two ancient titans, Godzilla and Kong, clash in an epic battle as humans unravel hidden mysteries of their origins.",
    genre: {
      name: "disaster",
      description:
        "Films that depict large‑scale catastrophes, often involving natural or man‑made destruction.",
    },
    imageURL:
      "https://m.media-amazon.com/images/M/MV5BMmY5YmVjODgtZTQ2ZS00OWMxLTg3NGItNzBhOWU3Mjg0Y2Y1XkEyXkFqcGdeQXVyMTUzOTcyODA5._V1_.jpg",
    director: {
      name: "Adam Wingard",
      bio: "American director from indie horror to major franchise work like Godzilla vs. Kong (2024).",
      birthYear: 1982,
      deathYear: null,
    },
    featured: false,
  },
  {
    title: "2001: A Space Odyssey",
    description:
      "When a mysterious artifact is uncovered on the Moon, a spacecraft manned by two humans and a sentient computer is sent to Jupiter to uncover its origins.",
    genre: {
      name: "artificial intelligence",
      description:
        "Stories exploring the emergence or impact of intelligent machines and human‑technology relationships.",
    },
    imageURL:
      "https://m.media-amazon.com/images/M/MV5BMjk3OTY5MzMtNzYxNy00Mjk4LWEyMWUtNjEzZjg5NjkwNmJkXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    director: {
      name: "Stanley Kubrick",
      bio: "Reclusive visionary director behind Path of Glory (1957), 2001 (1968), and A Clockwork Orange (1971); noted perfectionist.",
      birthYear: 1928,
      deathYear: 1999,
    },
    featured: false,
  },
  {
    title: "Final Destination: Bloodlines",
    description:
      "Plagued by violent premonitions, a young woman attempts to unravel a deadly curse that has haunted her family for generations.",
    genre: {
      name: "horror",
      description:
        "Intended to frighten through suspense, supernatural elements, or violence.",
    },
    imageURL:
      "https://m.media-amazon.com/images/M/MV5BN2FhNmNiODItOTk2NC00NGFiLWE3ZTctMjEyMjZhMGRiYTYxXkFqcGdeQXVyMzY0MTE3NzU@._V1_.jpg",
    director: {
      name: "Zach Lipovsky",
      bio: "Canadian director and VFX specialist; rose to prominence on On the Lot and directed Final Destination: Bloodlines (2025).",
      birthYear: null,
      deathYear: null,
    },
    featured: false,
  },
  {
    title: "Apocalypto",
    description:
      "In the twilight of the Mayan civilization, a young man must escape captivity and return home to save his family from ritual sacrifice.",
    genre: {
      name: "epic",
      description:
        "Large‑scale, sweeping narratives often set in the past or in mythic settings, focused on heroic journeys or societal collapse.",
    },
    imageURL:
      "https://m.media-amazon.com/images/M/MV5BNzE4ODU5NzktNmViZS00NzdiLThhNmEtNzc2ZDk2ZDVmZjY2XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
    director: {
      name: "Mel Gibson",
      bio: "Actor‑turned‑director of Braveheart (1995) and Apocalypto (2006); Academy Award winner with a controversial public persona.",
      birthYear: 1956,
      deathYear: null,
    },
    featured: false,
  },
  {
    title: "The Polar Express",
    description:
      "On Christmas Eve, a young boy embarks on a magical adventure to the North Pole aboard the Polar Express train.",
    genre: {
      name: "epic",
      description: "Large‑scale narratives that evoke wonder or heroism.",
    },
    imageURL:
      "https://m.media-amazon.com/images/M/MV5BMjEwMDQ4NTk5OF5BMl5BanBnXkFtZTcwNjQ5OTUzMw@@._V1_.jpg",
    director: {
      name: "Robert Zemeckis",
      bio: "Visual effects pioneer behind Back to the Future (1985), Forrest Gump (1994), and motion‑capture Polar Express (2004).",
      birthYear: 1952,
      deathYear: null,
    },
    featured: false,
  },
];
app.get("/movies", (req, res) => {
  res.status(200).send(movieArray);
});

app.get("/movies/:title", (req, res) => {
  let title = movieArray.find((movie) => {
    return movie.title.toLowerCase() === req.params.title.toLowerCase();
  });

  if (!title) {
    res.status(404).send("Sorry there is no movie with that title");
  } else {
    res.status(200).json(title);
  }
});

app.get("/genres/:name", (req, res) => {
  let movie = movieArray.find((movie) => {
    return movie.genre.name.toLowerCase() === req.params.name.toLowerCase();
  });

  if (!movie) {
    res.status(404).send("Sorry there is no such genre in the data");
  } else {
    res.status(200).json(movie.genre);
  }
});

app.get("/directors/:name", (req, res) => {
  let movie = movieArray.find((movie) => {
    return movie.director.name.toLowerCase() === req.params.name.toLowerCase();
  });

  if (!movie) {
    res.send(404).send("Sorry there is no such director in the data");
  } else {
    res.status(200).json(movie.director);
  }
});

app.post("/users", (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.send(400);
  }
});

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updateUser = req.body;

  let user = users.find((user) => {
    return user.id == id;
  });

  if (user) {
    user.name = updateUser.name;
    res.status(200).json(user);
  } else {
    res.status(404).send("No user with this id");
  }
});

app.post("/users/:id/movies/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => {
    return user.id == id;
  });

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res
      .status(201)
      .send(`${movieTitle} successfully added to ${user.id} favotires list`);
  } else {
    res.status(400).send("no such user");
  }
});

app.delete("/users/:id/movies/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;
  let user = users.find((user) => {
    return user.id == id;
  });

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter((movie) => {
      return movie !== movieTitle;
    });
    res
      .status(200)
      .send(
        `${movieTitle} successfully removed from ${user.id} favorites list`
      );
  } else {
    res.status(400).send("No such user found");
  }
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  let user = users.find((user) => {
    return user.id == id;
  });

  if (user) {
    users = users.filter((user) => {
      return user.id != id;
    });
    res.status(200).send(`${user.id} successfully removed.`);
  } else {
    res.status(400).send("No such user found");
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Houston, we have a problem!");
});

console.log("🥳 Success! App running on port 9090");
app.listen(9090);
