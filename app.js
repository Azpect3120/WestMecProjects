// Dependencies
const express = require("express");
const session = require("express-session");
const QRCode = require("qrcode");
const app = express();

// View & Engine
app.set("view engine", "ejs");
app.set("views", "view");

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(session({
    secret: "ikgnjknag890h2uibui",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true, maxAge: null, session: true }
}));


// Routes
app.get("/", (req, res) => {
    let imgSrc = null;
    if (req.session.loaded) {
        imgSrc = req.session.loaded.src || null;
    }
    res.status(200).render("index", { imgSrc, history: req.session.history || [] });
});

// Generate a QR code
app.get("/generate", (req, res) => {
    const data = req.query.url || " ";

    const options = {
        width: 400,
    }

    QRCode.toDataURL(data, options, (err, url) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error 500: Internal Server Error");
            return;
        }

        if (!req.session.history) {
            req.session.history = [];
        }        
        
        req.session.history.unshift({ data: data || " ", src: url });
        
        // res.status(200).render("index", { imgSrc: url, history: req.session.history });
        req.session.loaded = { data: data || " ", src: url };
        res.status(301).redirect("/");
    });
});

// Download a QR code .png file
app.get("/download", (req, res) => {
    const source = req.query.source;
    
    const buffer = Buffer.from(source.split(',')[1], 'base64');

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename="qrcode.png"');

    res.status(200).send(buffer);
});


// Fallback 404: not found
app.all("*", (req, res) => {
    res.status(404).send("Error 404: Resource Not Found");
});

// Open server
app.listen(3000, () => console.log("Server listening on port 3000"));