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
    res.status(200).render("index", { data });
});

// Query the json file for games with the matching title and render resulting cards
app.get("/search", (req, res) => {
    const query = req.query.titles.toLowerCase();
    const valid = data.filter(game => game.title.toLowerCase().includes(query));
    res.status(200).render("index", { data: valid });       
});


// Launch server
app.listen(3000, () => console.log("Server is active at localhost:3000/"));