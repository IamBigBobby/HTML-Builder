const fs = require('fs');
const path = require('path');
let arrBundle = [];

fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), '', (err) => {
  if (err) throw err;
  console.log('bundle.css has been created');
});

const outBundle = fs.createWriteStream(
  path.join(__dirname, '/project-dist', 'bundle.css'),
  (err) => {
    if (err) throw err;
  },
);

fs.readdir(
  path.join(__dirname, 'styles'),
  { withFileTypes: true },
  (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      let styleFile = path.join(__dirname, 'styles', file.name);

      if (file.isFile()) {
        if (path.extname(styleFile) === '.css') {
          let stream = fs.createReadStream(styleFile, 'utf8');

          stream.on('data', (chunk) => {
            arrBundle.push(chunk);
          });

          stream.on('error', (err) => {
            if (err) throw err;
          });

          stream.on('end', () => {
            outBundle.write(arrBundle.pop().trim());
          });
        }
      }
    });
  },
);
