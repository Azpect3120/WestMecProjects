// Imports
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Static files & images
app.use(express.static("./public/images"));

// Set views & view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Load pages from views
app.get("/*", (req, res) => {
    if (req.url === "/") {
        res.render('home');
    } else {
        res.render(req.url.slice(1));
    }
});

// Listen for connections
app.listen(PORT, () => {
    console.log(`Running on port: ${PORT}`);
});
