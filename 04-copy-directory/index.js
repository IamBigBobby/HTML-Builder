const fs = require('fs');
const path = require('path');

const copyFolderPath = path.join(__dirname, 'copy-files');

// Удаление предыдущей версии папки
fs.rm(copyFolderPath, { recursive: true, force: true }, (err) => {
  if (err && err.code !== 'ENOENT') {
    // Если произошла ошибка, кроме того, что папка не существует (ENOENT), выбросить ошибку
    throw err;
  }

  // Создание новой папки после удаления предыдущей
  fs.mkdir(copyFolderPath, { recursive: true }, (err) => {
    if (err) throw err;
    console.log('Folder has been created');

    // Копирование файлов
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
              console.log(`${file.name}`);
            },
          );
        });
      },
    );
  });
});
