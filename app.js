const express = require("express");
const app = express();

app.use(express.static("public"));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", "views");


const data = require("./data/NintendoGames.json");

const game = data[0];


app.get("/", (req, res) => {    
    res.status(200).render("index", { data });
});






app.listen(3000, () => console.log("Server is active at localhost:3000/"));