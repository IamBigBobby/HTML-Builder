const fs = require('fs');
const path = require('path');

const arrBundleCss = [];
const assetsDirectory = path.join(__dirname, 'assets');
const assetsCopyDirectory = path.join(__dirname, 'project-dist', 'assets');
const teamplateHtml = path.join(__dirname, 'template.html');
const indexHtml = path.join(__dirname, 'project-dist', 'index.html');
const styleCss = path.join(__dirname, 'project-dist', 'style.css');

// create directories
fs.mkdirSync(path.join(__dirname, 'project-dist'), { recursive: true });
fs.mkdirSync(path.join(__dirname, 'project-dist/assets'), { recursive: true });

// create files
fs.writeFileSync(path.join(__dirname, 'project-dist', 'index.html'), '');

// merge styles
fs.readdirSync(path.join(__dirname, 'styles')).forEach((file) => {
  let styleFile = path.join(__dirname, 'styles', file);

  if (fs.statSync(styleFile).isFile() && path.extname(styleFile) === '.css') {
    let cssContent = fs.readFileSync(styleFile, 'utf8');
    arrBundleCss.push(cssContent);
  }
});

// write bundled styles to file
fs.writeFileSync(styleCss, arrBundleCss.join('').trim());

// fill index
fs.copyFileSync(teamplateHtml, indexHtml);
let templateData = fs.readFileSync(teamplateHtml, 'utf-8');
let sections = templateData.match(/{{\w+}}/gm);

sections.forEach((section) => {
  let sectionTemplate = path.join(
    __dirname,
    'components',
    `${section.slice(2, -2)}.html`,
  );

  let sectionTagData = fs.readFileSync(sectionTemplate, 'utf-8');
  templateData = templateData.replace(section, sectionTagData);
});

fs.writeFileSync(indexHtml, templateData);

// copy assets
function copyAssets(directory, copyDirectory) {
  fs.readdirSync(directory).forEach((file) => {
    let pathDir = path.join(directory, file);
    let pathDirCopy = path.join(copyDirectory, file);

    if (fs.statSync(pathDir).isFile()) {
      fs.copyFileSync(pathDir, pathDirCopy);
    }
    if (fs.statSync(pathDir).isDirectory()) {
      fs.mkdirSync(pathDirCopy, { recursive: true });
      copyAssets(pathDir, pathDirCopy);
    }
  });
}

copyAssets(assetsDirectory, assetsCopyDirectory);
