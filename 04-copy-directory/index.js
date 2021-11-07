const FOLDER_NAME = 'files';
const FOLDER_NAME_COPY = 'files-copy';

const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const pathFrom = path.join(__dirname, FOLDER_NAME);
const pathTo = path.join(__dirname, FOLDER_NAME_COPY);

fsPromises.mkdir(pathTo, { recursive: true }, async function (err) {
  if (err) throw err;
});

try {
  readFiles(pathFrom, pathTo);
}
catch (err) {
  throw err;
}

async function readFiles(dirFrom, dirTo) {
  const files = await fsPromises.readdir(dirFrom, { withFileTypes: true });
  files.forEach(async function (file) {
    if(file.isFile()) {
      const filePathFrom = path.join(dirFrom, file.name);
      const filePathTo = path.join(dirTo, file.name);

      fs.copyFile(filePathFrom, filePathTo, (err) => {
        if (err) throw err;
      });
    };
  });
}
