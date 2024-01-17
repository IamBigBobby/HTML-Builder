const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('node:process');
const rl = readline.createInterface({ input, output });

fs.writeFile(path.join(__dirname, '', 'insert.txt'), '', (err) => {
  if (err) throw err;
  console.log('Enter your text');
});

rl.on('line', (data) => {
  let insert = `${data.toString()}\n`;
  if (insert == 'exit\n') {
    console.log('Thanks for testing');
    rl.close();
  } else {
    fs.appendFile(path.join(__dirname, '', 'insert.txt'), insert, (err) => {
      if (err) throw err;
    });
  }
});
rl.on('SIGINT', () => {
  console.log('Thanks for testing');
  rl.close();
});
