const fs = require('fs');
const path = require('path');

fs.readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      if (file.isFile()) {
        fs.stat(
          path.join(__dirname, 'secret-folder', file.name),
          (err, stats) => {
            if (err) throw err;

            let currentFile = file.name.split('.');
            let size = stats.size;
            console.log(`${currentFile[0]} - ${currentFile[1]} - ${size}B`);
          },
        );
      }
    });
  },
);
