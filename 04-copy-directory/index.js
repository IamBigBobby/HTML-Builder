const fs = require('fs');
const path = require('path');

const copyFolderPath = path.join(__dirname, 'copy-files');

fs.rm(copyFolderPath, { recursive: true, force: true }, (err) => {
  if (err && err.code !== 'ENOENT') {
    throw err;
  }

  fs.mkdir(copyFolderPath, { recursive: true }, (err) => {
    if (err) throw err;
    console.log('Folder has been created');

    fs.readdir(
      path.join(__dirname, 'files'),
      { withFileTypes: true },
      (err, files) => {
        if (err) throw err;

        files.forEach((file) => {
          fs.copyFile(
            path.join(__dirname, 'files', file.name),
            path.join(copyFolderPath, file.name),
            (err) => {
              if (err) throw err;
            },
          );
        });
      },
    );
  });
});
