/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

function updateImports(filename) {
  try {
    const filePath = path.resolve(__dirname, filename);
    let content = fs.readFileSync(filePath, 'utf-8');

    content = content.replace(
      /require\("\.\/logger"\)/g,
      `require('./logger/index.cjs')`,
    );
    content = content.replace(/require\("\.\/utils"\)/g, `require('./utils/index.cjs')`);
    content = content.replace(
      /require\("\..\/utils"\)/g,
      `require('../utils/index.cjs')`,
    );

    fs.writeFileSync(filePath, content, 'utf-8');
  } catch (err) {
    console.log(err);
  }
}

updateImports('../dist/cjs/index.cjs');
updateImports('../dist/cjs/logger/index.cjs');
