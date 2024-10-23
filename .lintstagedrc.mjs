export default {
  '**/*.(ts)': 'tsc --noEmit',
  '**/*.(ts|js|cjs|mjs)': filenames => [
    `eslint --fix ${filenames.join(' ')}`,
    `prettier --write ${filenames.join(' ')} --config .prettierrc`,
  ],
  '**/*.(md|json)': filenames => [
    `prettier --write ${filenames.join(' ')} --config .prettierrc`,
  ],
};
