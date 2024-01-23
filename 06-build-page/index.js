const fs = require('fs');
const path = require('path');

const arrBundleCss = [];
const assetsDirectory = path.join(__dirname, 'assets');
const assetsCopyDirectory = path.join(__dirname, 'project-dist', 'assets');
const teamplateHtml = path.join(__dirname, 'template.html');
const indexHtml = path.join(__dirname, 'project-dist', 'index.html');

// writeStream
const outBundleCss = fs.createWriteStream(
  path.join(__dirname, '/project-dist', 'style.css'),
  (err) => {
    if (err) throw err;
  },
);

// create directories
fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
  if (err) throw err;
  fs.mkdir(
    path.join(__dirname, 'project-dist/assets'),
    { recursive: true },
    (err) => {
      if (err) throw err;
      // create files
      fs.writeFile(indexHtml, '', (err) => {
        if (err) throw err;

        // merge styles
        fs.readdir(
          path.join(__dirname, 'styles'),
          { withFileTypes: true },
          (err, files) => {
            if (err) throw err;

            files.forEach((file) => {
              let styleFile = path.join(__dirname, 'styles', file.name);

              if (file.isFile() && path.extname(styleFile) === '.css') {
                let stream = fs.createReadStream(styleFile, 'utf8');

                stream.on('data', (chunk) => {
                  arrBundleCss.push(chunk);
                });

                stream.on('error', (err) => {
                  if (err) throw err;
                });

                stream.on('end', () => {
                  outBundleCss.write(arrBundleCss.pop().trim());
                });
              }
            });
          },
        );

        // fill index
        fs.copyFile(teamplateHtml, indexHtml, (err) => {
          if (err) throw err;

          fs.readFile(teamplateHtml, 'utf-8', (err, data) => {
            if (err) throw err;

            let templateData = data;
            let sections = data.match(/{{\w+}}/gm);

            sections.forEach((section) => {
              let sectionTemplate = path.join(
                __dirname,
                'components',
                `${section.slice(2, -2)}.html`,
              );

              fs.readFile(sectionTemplate, 'utf-8', (err, sectionTagData) => {
                if (err) throw err;

                templateData = templateData.replace(section, sectionTagData);

                fs.rm(indexHtml, { recursive: true }, (err) => {
                  if (err) throw err;

                  let indexStream = fs.createWriteStream(indexHtml);
                  indexStream.write(templateData);
                });
              });
            });
          });
        });
      });
    },
  );
});

// copy assets
function copyAssets(directory, copyDirectory) {
  fs.readdir(path.join(directory), { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      let pathDir = path.join(directory, file.name);
      let pathDirCopy = path.join(copyDirectory, file.name);

      if (file.isFile()) {
        fs.access(pathDir, fs.constants.F_OK, (err) => {
          if (err) {
            console.error(`File not found: ${pathDir}`);
            return;
          }

          fs.copyFile(pathDir, pathDirCopy, (err) => {
            if (err) throw err;
          });
        });
      }
      if (file.isDirectory()) {
        fs.mkdir(pathDirCopy, { recursive: true }, (err) => {
          if (err) throw err;
        });
        copyAssets(pathDir, pathDirCopy);
      }
    });
  });
}

copyAssets(assetsDirectory, assetsCopyDirectory);
