export default {
  'src/*.(ts)': 'tsc --noEmit',
  'src/*.(ts|js|cjs|mjs)': filenames => [
    `eslint --fix ${filenames.join(' ')}`,
    `prettier --write ${filenames.join(' ')} --config .prettierrc`,
  ],
  '**/*.(md|json)': filenames => [
    `prettier --write ${filenames.join(' ')} --config .prettierrc`,
  ],
};
