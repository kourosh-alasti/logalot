import pluginJs from '@eslint/js';
// import prettier from 'eslint-config-prettier';
// import tslint from 'eslint-config-typescript';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ['./src/**/*.{js,mjs,cjs,ts'] },
  {
    plugins: { 'simple-import-sort': simpleImportSort },

    rules: {
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
    },
  },
];
