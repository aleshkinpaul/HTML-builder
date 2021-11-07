const FILE_NAME = 'text.txt';

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const textFilePath = path.join(__dirname, FILE_NAME);

fs.writeFile(textFilePath, '', (err) => {
  if (err) throw err;
});

rl.setPrompt(`Hello! Write something for adding in file ${FILE_NAME}:\n`);
rl.prompt();
rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    process.exit();
  }
  else if (input.trim() !== '') {
    fs.appendFile(textFilePath, input + '\n', (err) => {
      if (err) throw err;
    });
    rl.setPrompt(`Write something else for ${FILE_NAME}:\n`);
    rl.prompt();
  }
  else {
    rl.setPrompt('This string is empty. Write something again:\n');
    rl.prompt();
  }
})

process.on('exit', () => {
  console.log(`\nThanks! Input finished!\nYou can watch result in file ${FILE_NAME}\nFile directory: ${textFilePath}\nGood Luck!`);
});
