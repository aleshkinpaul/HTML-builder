"use strict"

const SRC_STYLES_FOLDER = 'styles';
const SRC_ASSETS_FOLDER = 'assets';
const SRC_COMPONENTS_FOLDER = 'components';
const SRC_TEMPLATE_HTML_FILE = 'template.html';
const PROJECT_FOLDER = 'project-dist';
const PROJECT_ASSETS_FOLDER = 'assets';
const PROJECT_STYLES_FILE = 'style.css';
const PROJECT_INDEX_FILE = 'index.html';

const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const pathTemplateHTML = path.join(__dirname, SRC_TEMPLATE_HTML_FILE);
const pathAssetsFolder = path.join(__dirname, SRC_ASSETS_FOLDER);
const pathComponents = path.join(__dirname, SRC_COMPONENTS_FOLDER);
const pathStyles = path.join(__dirname, SRC_STYLES_FOLDER);
const pathProject = path.join(__dirname, PROJECT_FOLDER);
const pathProjectIndexFile = path.join(pathProject, PROJECT_INDEX_FILE);
const pathProjectAssetsFolder = path.join(pathProject, PROJECT_ASSETS_FOLDER);
const pathProjectStylesFile = path.join(pathProject, PROJECT_STYLES_FILE);

fsPromises.mkdir(pathProject, { recursive: true }, err => { if (err) throw err });
fs.writeFile(pathProjectStylesFile, '', err => { if (err) throw err });

try {
  readFiles(__dirname);
}
catch (err) {
  throw err;
}

async function readFiles(dir) {
  const files = await fsPromises.readdir(dir, { withFileTypes: true });

  for await (const file of files) {
    if (file.name === SRC_ASSETS_FOLDER && !file.isFile()) {
      deleteFiles(pathProjectAssetsFolder);
      setTimeout(() => {
        copyFiles(pathAssetsFolder, pathProjectAssetsFolder);
      }, 500);
    }
    else if (file.name === SRC_STYLES_FOLDER && !file.isFile()) {
      const files = await fsPromises.readdir(pathStyles, { withFileTypes: true });

      for await (const file of files) {
        if(file.isFile() && path.extname(file.name) === '.css') {
          const filePath = path.join(pathStyles, file.name);

          fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) throw err;
            fs.appendFile(pathProjectStylesFile, data + '\n', (err) => { if (err) throw err });
          });
        };
      };
    }
    else if (file.name === SRC_TEMPLATE_HTML_FILE) {
      const regExp = /\{\{.*\}\}/g;

      fs.readFile(pathTemplateHTML, 'utf-8', async function (err, data) {
        if (err) throw err;

        fs.writeFile(pathProjectIndexFile, data, err => { if (err) throw err });
      })

      fs.readFile(pathTemplateHTML, 'utf-8', async function (err, data) {
        if (err) throw err;

        const componentsArr = data.match(regExp);
        let indexData = data;

        componentsArr.forEach(component => {
          const componentName = component.substring(2, component.length - 2) + '.html';
          const componentPath = path.join(pathComponents, componentName);

          fs.readFile(componentPath, 'utf-8', (err, data) => {
            if (err) throw err;

            indexData = indexData.replace(component, data);
            fs.writeFile(pathProjectIndexFile, indexData, err => { if (err) throw err });
          })
        });
      })
    };
  };
}
async function deleteFiles(folderPath) {
  fs.access(folderPath, async function (err) {
    if (!err) {

      const files = await fsPromises.readdir(folderPath, { withFileTypes: true });
      const folders = [];
    
      for await (const file of files) {
        if(file.isFile()) {
          fs.unlink(path.join(folderPath, file.name), err => { if (err) throw err });
        }
        else folders.push(file.name);
      };
    
      for await (const folder of folders) {
        const subFolderPath = path.join(folderPath, folder);
        deleteFiles(subFolderPath);
      }
    
      await fsPromises.rmdir(folderPath, { recursive: true }, err => { if (err) throw err });
    }
  })
}

async function copyFiles(folderPathFrom, folderPathTo) {
  createFolder(folderPathTo);

  const files = await fsPromises.readdir(folderPathFrom, { withFileTypes: true });
  const folders = [];

  for await (const file of files) {
    if(file.isFile()) {
      const filePathFrom = path.join(folderPathFrom, file.name);
      const filePathTo = path.join(folderPathTo, file.name);

      fs.copyFile(filePathFrom, filePathTo, err => { if (err) throw err });
    }
    else folders.push(file.name);
  };

  for await (const folder of folders) {
    const subFolderPathFrom = path.join(folderPathFrom, folder);
    const subFolderPathTo = path.join(folderPathTo, folder);

    copyFiles(subFolderPathFrom, subFolderPathTo);
  };
}

function createFolder(folderPath) {
  fsPromises.mkdir(folderPath, { recursive: true }, err => { if (err) throw err });
}