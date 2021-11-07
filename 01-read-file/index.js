const fs = require('fs');
const path = require('path');

const textFilePath = path.join(__dirname, 'text.txt');

fs.readFile(textFilePath, 'utf-8', (err, data) => {
  if (err) throw err;
  console.log(data);
});