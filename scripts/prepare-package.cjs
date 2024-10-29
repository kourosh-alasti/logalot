/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const buildDirectory = './dist';

function createEsmModulePackageJSON() {
  fs.readdir(buildDirectory, function (err, dirs) {
    if (err) {
      throw err;
    }

    dirs.forEach(function (dir) {
      if (dir === 'esm') {
        var packageJSONFile = path.join(buildDirectory, dir, '/package.json');

        if (!fs.existsSync(packageJSONFile)) {
          fs.writeFile(
            packageJSONFile,
            new Uint8Array(Buffer.from('{"type": "module"}')),
            function (err) {
              if (err) {
                throw err;
              }
            },
          );
        }
      }
    });
  });
}

createEsmModulePackageJSON();
