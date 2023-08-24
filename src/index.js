// Dependencies
const MD = require('markdown-it')();
const FS = require('fs');
const readline = require('readline');


// Paths
const inputPath = "./input.md";
const outputPath = "./output.html";

// Read input file data
async function readInput (path)
{
    // Open file into a read stream
    const IFStream = FS.createReadStream(path, 'utf-8');

    // Create readline object using the file stream
    const RL = readline.createInterface({
        input: IFStream
    });

    // File data string
    let fileData = "";

    // Line event
    for await (const line of RL) {
        fileData += line + " \n";
    }

    // Return final string
    return fileData;
};

// Convert MD data into HTML data
function convert (data)
{
    return MD.render(data)
}

// Write file data into path
function writeOutput (path, data)
{
    // Open output file using a write stream
    const OFSteam = FS.createWriteStream(path, {
        encoding: 'utf-8',
        flags: 'w'
    });

    // Write the data into the file
    OFSteam.write(data);

    // When the file is finished, print line
    OFSteam.on('finish', () => {
        console.log("File was converted!");
    });
}

// Read file data
const fileData = readInput(inputPath);

// Write file data
fileData.then(data => {
    console.log(data);
    writeOutput(outputPath, convert(data));
});