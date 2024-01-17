const fs = require('fs');
const path = require('path');

fs.mkdir(path.join(__dirname, 'copy-files'), { recursive: true }, (err) => {
  if (err) throw err;
  console.log('Folder has been created');
});

fs.readdir(
  path.join(__dirname, 'files'),
  { withFileTypes: true },
  (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      fs.copyFile(
        path.join(__dirname, 'files', file.name),
        path.join(__dirname, 'copy-files', file.name),
        (err) => {
          if (err) throw err;
        },
      );
    });
  },
);
