module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-console': 'off',
    'no-unused-vars': 'off',
    'max-len': ['error', 160],
    'no-param-reassign': 'off',
    'import/extensions': 'off',
    'no-useless-escape': 'off',
    'no-mixed-operators': 'off',
    'import/no-unresolved': 'off',
    'no-underscore-dangle': 'off',
    'import/no-mutable-exports': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
};
