const express = require("express"),
  morgan = require("morgan"),
  fs = require("fs"),
  path = require("path");

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

app.use(morgan("combined", { stream: accessLogStream }));

app.use(express.static("public"));

const movieArray = [
  {
    title: "Chronicle",
    yearOfProduction: "2012",
    director: "Josh Trank",
    genres: ["sci-fi", "thriller", "drama", "superhero"],
  },
  {
    title: "Jumper",
    yearOfProduction: "2008",
    director: "Doug Liman",
    genres: ["sci-fi", "thriller", "action", "superhero"],
  },
  {
    title: "Spider-Man",
    yearOfProduction: "2002",
    director: "Sam Raimi",
    genres: ["sci-fi", "thriller", "teen adventure", "superhero"],
  },
  {
    title: "Monsters, Inc.",
    yearOfProduction: "2001",
    director: "Pete Docter",
    genres: ["buddy comedy", "slapstick", "computer animation", "adventure"],
  },
  {
    title: "Silent Night",
    yearOfProduction: "2023",
    director: "John Woo",
    genres: ["tragedy", "psychological drama", "action", "thriller"],
  },
  {
    title: "Godzilla x Kong: The New Empire",
    yearOfProduction: "2024",
    director: "Adam Wingard",
    genres: ["disaster", "kaiju", "action", "sci-fi"],
  },
  {
    title: "2001: A Space Odyssey",
    yearOfProduction: "1968",
    director: "Stanley Kubrick",
    genres: ["artificial intelligence", "epic", "sci-fi epic", "adventure"],
  },
  {
    title: "Final Destination: Bloodlines",
    yearOfProduction: "2025",
    director: "Zach Lipovsky",
    genres: ["horror", "action", "thriller"],
  },
  {
    title: "Apocalypto",
    yearOfProduction: "2006",
    director: "Mel Gibson",
    genres: ["epic", "drama", "action", "thriller"],
  },
  {
    title: "The Polar Express",
    yearOfProduction: "2004",
    director: "Robert Zemeckis",
    genres: ["epic", "computer animation", "adventure", "musical"],
  },
];

app.get("/movies", (req, res) => {
  res.send(movieArray);
});

app.get("/", (req, res) => {
  res.send("You have reached the / route");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Houston, we have a problem!");
});

console.log("🥳 Success! App running on port 9090");
app.listen(9090);
