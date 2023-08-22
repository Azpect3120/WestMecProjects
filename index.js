// Imports
const http = require("http");
const fs = require("fs");

// Server settings
const serverData = {
    // Server host and port
    host: "localhost",
    port: 3000,
    // Page data: paths and data
    pages: {
        base: {
            path: "./base.html",
            data: fs.readFileSync("./base.html")
        },
        home: {
            path: "./home.html",
            data: fs.readFileSync("./home.html")
        },
        projects: {
            path: "./projects.html",
            data: fs.readFileSync("./projects.html")
        },
        about: {
            path: "./about.html",
            data: fs.readFileSync("./about.html")
        },
        contact: {
            path: "./contact.html",
            data: fs.readFileSync("./contact.html")
        }
    },
    // Image source directory
    images: "/w3images/"
}

// Create the server
const server = http.createServer((req, res) => {
    
    // Load webpage
    if (req.url === "/") {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.write(serverData.pages.base.data);
        res.end();

    // Home page
    } else if (req.url === "/home") { 
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.write(serverData.pages.base.data);
        res.end();
    
    // Projects page
    } else if (req.url === "/projects") { 
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.write(serverData.pages.projects.data);
        res.end();

    // Contact page
    } else if (req.url === "/contact") { 
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.write(serverData.pages.contact.data);
        res.end();

    // About page
    } else if (req.url === "/about") { 
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.write(serverData.pages.about.data);
        res.end();

    // Load source code
    } else if (req.url === "/source") {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.write(serverData.pages.home.data + "\n");
        res.write(serverData.pages.projects.data + "\n");
        res.write(serverData.pages.about.data + "\n");
        res.write(serverData.pages.contact.data);
        res.end();

    // Contact me form was submitted
    } else if (req.url.startsWith("/contactMeSubmission")) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.write(serverData.pages.base.data);
        res.end();

    // Load images
    } else if (req.url.startsWith(serverData.images)) {
        // Read the file requested by the url
        fs.readFile("." + req.url, (err, data) => {
            if (err) {
                res.statusCode = 404;
                res.end("Not Found");
            } else {
                res.setHeader("Content-Type", "image/jpg");
                res.end(data);
            }
        });

    // Request to a different endpoint: 404
    } else {
        res.statusCode = 404;
        res.end("Not Found");
    }
});

// Open server
server.listen(serverData.port, serverData.host, () => {
    console.log(`Server is listening on http://${serverData.host}:${serverData.port}`);
});