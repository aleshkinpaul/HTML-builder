const FOLDER_NAME = 'files';
const FOLDER_NAME_COPY = 'files-copy';

const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const pathFrom = path.join(__dirname, FOLDER_NAME);
const pathTo = path.join(__dirname, FOLDER_NAME_COPY);

try {
  (async function() {
    await createFolder(pathTo);
    await deleteFiles(pathTo);
    copyFiles(pathFrom, pathTo);
  })();
}
catch (err) {
  throw err;
}

async function createFolder(folderPath) {
  fsPromises.mkdir(folderPath, { recursive: true }, async function (err) {
    if (err) throw err;
  });
}

async function deleteFiles(dir) {
  const files = await fsPromises.readdir(dir, { withFileTypes: true });
  for await (file of files) {
    if(file.isFile()) {
      fs.unlink(path.join(dir, file.name), err => { if (err) throw err });
    };
  }
}

async function copyFiles(dirFrom, dirTo) {
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
