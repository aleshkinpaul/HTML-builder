const STYLES_FOLDER = 'styles';
const PROJECT_FOLDER = 'project-dist';
const PROJECT_STYLES_FILE = 'bundle.css';

const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const pathStyles = path.join(__dirname, STYLES_FOLDER);
const pathProject = path.join(__dirname, PROJECT_FOLDER);
const pathProjectStylesFile = path.join(pathProject, PROJECT_STYLES_FILE);

fs.writeFile(pathProjectStylesFile, '', (err) => {
  if (err) throw err;
});

try {
  readFiles(pathStyles);
}
catch (err) {
  throw err;
}

async function readFiles(dir) {
  const files = await fsPromises.readdir(dir, { withFileTypes: true });
  files.forEach(async function (file) {
    if(file.isFile() && path.extname(file.name) === '.css') {
      const filePath = path.join(dir, file.name);
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) throw err;
        fs.appendFile(pathProjectStylesFile, data + '\n', (err) => {
          if (err) throw err;
        });
      });
    };
  });
}
