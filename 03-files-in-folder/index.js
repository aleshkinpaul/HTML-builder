const FOLDER_NAME = 'secret-folder';

const fsPromises = require('fs/promises');
const path = require('path');

const dirToRead = path.join(__dirname, FOLDER_NAME);

try {
  readFiles (dirToRead);
}
catch (err) {
  throw err;
}

async function readFiles(dir) {
  const files = await fsPromises.readdir(dir, { withFileTypes: true });
  console.log(`Files in folder "${FOLDER_NAME}":`);
  files.forEach(async function (file) {
    if(file.isFile()) {
      const fileDir = path.join(dirToRead, file.name);
      const extName = path.extname(fileDir);
      const baseName = path.basename(fileDir, extName);
      const stat = await (await fsPromises.open(fileDir)).stat();
      const size = Math.floor(stat.size / 1024 * 100) / 100;

      console.log(`${baseName} - ${extName.substring(1)} - ${size} kb`);
    };
  });
}