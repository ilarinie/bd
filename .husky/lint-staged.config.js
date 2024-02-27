module.exports = {
  '*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix --quiet --ignore-pattern'],
  'src/**/*.{js,jsx,ts,tsx}': () => 'npx tsc --noEmit',
}
