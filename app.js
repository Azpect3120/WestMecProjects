const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { encryptString, compare } = require("./model/crypto");
const User = require("./model/user");
const session = require("express-session");

const app = express();

// View engine
app.set("view engine", "ejs");
app.set("views", "views");

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000,
    }
}));

// Connect to database
mongoose.connect(process.env.DB_URL || "")
  .then(() => console.log("Connected to database"))
  .catch(err => console.error(err)); 

// Render pages
app.get("/", (req, res) => {
    res.status(301).redirect("/login");
});

app.get("/signup", (req, res) => {
    res.status(200).render("signup");
});

app.get("/login", (req, res) => {
    res.status(200).render("login");
});

app.get("/forgot", (req, res) => {
    res.status(200).render("forgot");
});

app.get("/home", (req, res) => {
    const user = req.session.user;
    if (user) {
        res.status(200).render("home", { user });    
    } else {
        res.status(404).redirect("/login");
    }
});

// Register a new user in the database
app.post("/register", (req, res) => {
    // Form submission
    const { firstName, lastName, password, confirmPassword, email } = req.body;

    let encryptedPassword;

    // Ensure passwords match and encrypt them
    if (password === confirmPassword) {
        encryptedPassword = encryptString(password);
    } else {
        res.status(409).render("error", { message: "Passwords do not match.", redirect: "signup", status: "409"});
        return;
    }

    // Create new user object
    const newUser = new User({
        firstName: firstName.trim() || "",
        lastName: lastName.trim() || "",
        password: encryptedPassword.trim() || "",
        email: email.trim() || ""
    });

    // Save user
    newUser.save({})
      .then(user => {
        req.session.user = user;
        res.status(201).redirect("/home")
      })
      .catch(err => {
        res.status(500).render("error", { message: "An error has occurred while saving the user.", redirect: "signup", status: "500"});
      });
});

// Log a user in
app.post("/login", async (req, res) => {
    // Request body
    const { email, password } = req.body;

    // Query database for email
    const results = await User.find({ email });

    // Match results
    if (results.length == 0) {
        res.status(404).render("error", { message: "Email or password was incorrect.", redirect: "login", status: "404" });
    } else {
        for (const user of results) {
            if (compare(user.password, password)) {
                req.session.user = user;
                res.status(200).redirect("/home");
                return;
            }
        }
        res.status(404).render("error", { message: "Email or password was incorrect.", redirect: "login", status: "404" });
    }
});

// Reset a users password
app.post("/reset", async (req, res) => {
    // Request body
    const { email, password, confirmPassword } = req.body;

    let encryptedPassword;

    // Ensure new and old password match
    if (password === confirmPassword) {
        encryptedPassword = encryptString(password);

        // Update database
        const user = await User.findOneAndUpdate({ email }, { password: encryptedPassword })

        // Respond
        if (user) {
            res.status(201).redirect("/login");
        } else {
            res.status(404).render("error", { message: "No user with the provided email was found.", redirect: "forgot", status: "404" });
        }
    } else {
        res.status(401).render("error", { message: "Provided passwords do not match.", redirect: "forgot", status: "401" });
    }
});

// Delete a users account
app.post("/delete", async (req, res) => {
    // Request body
    const { id, password } = req.body;

    // Query database for user
    const user = await User.findById(id);

    // Match passwords
    if (user) {
        if (compare(user.password, password)) {
            const result = await User.findByIdAndRemove(id);
            result != null ? res.status(204).redirect("/login") : res.status(500).render("error", { message: "There was an error while deleting your user.", redirect: "home", status: "500" });
        } else {
            res.status(401).render("error", { message: "Provided passwords do not match.", redirect: "home", status: "401" });
        }
    } else {
        res.status(404).render("error", { message: "User was not found in the database.", redirect: "login", status: "404" });
    }
});

// Logs the user out
app.get("/logout", (req, res) => {
    req.session.user = null;
    res.status(301).redirect("/login");
});

// Launch server
const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server is live at port ${PORT}`));