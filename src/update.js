const MD = require('markdown-it')();
const FS = require('fs');
const inp = FS.createReadStream("./input.md", "utf-8");
inp.on('data', chunk => {FS.createWriteStream("./output.html").write(MD.render(chunk));});