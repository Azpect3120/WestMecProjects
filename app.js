const express = require("express");
const multer = require("multer");
const zlib = require("zlib");
const fs = require("fs");
const app = express();

app.set("views", "views");
app.set("view engine", "ejs");

const upload = multer({ storage: multer.memoryStorage() });

app.get("/", (req, res) => {
    res.status(200).render("index");
});


app.post("/compress", upload.single("target_file"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    
    const metaBuffer = Buffer.from(req.file.originalname + "\n");

    const buffer = metaBuffer + req.file.buffer;

    const compressed = zlib.gzipSync(buffer);

    fs.writeFileSync(`./uploads/${req.file.originalname.split(".")[0]}.gz`, compressed);

    res.send("File compressed successfully.");
});

app.post("/decompress", upload.single("target_file"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    const fileString = zlib.gunzipSync(req.file.buffer).toString();

    const lines = fileString.split("\n");

    const fileName = lines[0];

    const fileBuffer = Buffer.from(lines.slice(1).join("\n"), "utf-8");

    fs.writeFileSync(`./uploads/${fileName}`, fileBuffer);

    res.send("File decompressed successfully.");

});


app.listen(3000);