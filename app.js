// Dependencies
const express = require("express");
const app = express();

// Middleware
app.use(express.static("public"));
app.use(express.json());

// Define view engine
app.set("view engine", "ejs");
app.set("views", "views");

// Import json data
const data = require("./data/NintendoGames.json");

// Sort by title
data.sort((a, b) => a.title.localeCompare(b.title));

// Load login page: load all games
app.get("/", (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const count = 10;
    const pageCount = (Math.floor(data.length / 10) + 1);
    const results = data.slice(((page - 1) * count), ((page - 1) * count) + count);
    res.status(200).render("index", { data: results, pageCount: pageCount || 0 });       
});

// Query the json file for games with the matching title and render resulting cards
app.get("/search", (req, res) => {
    const titles = req.query.titles.toLowerCase();
    const page = parseInt(req.query.page) || 1;
    const count = 10;
    const valid = data.filter(game => game.title.toLowerCase().includes(titles));
    const pageCount = (Math.floor(valid.length / 10) + 1);
    const results = valid.slice(((page - 1) * count), ((page - 1) * count) + count);
    console.log(results);
    res.status(200).render("index", { data: results, pageCount: pageCount || 0 });       
});

// Launch server
app.listen(3000, () => console.log("Server is active at localhost:3000/"));