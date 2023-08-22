// Import dependencies
require('dotenv').config();
const https = require('https');

// Load KEY form .env file
const api_key = process.env.KEY;


function getDef (term)
{
    try {
        const request = https.get(
            `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${term}?key=${api_key}`,
            response => {
                let body = "";
                
                response.on("data", data => {
                    body += data.toString();
                });

                response.on("end", () => {
                    console.log(JSON.parse(body)[0].shortdef);                    
                });

            }).on("error", err => {
                console.error(err);
            });
    } catch (err) {
        console.error(err);
    }
}

process.argv.slice(2).forEach(word => {
    getDef(word);
});