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
    'no-undef': 'off',
    'no-empty': 'off',
    'func-names': 'off',
    'no-cond-assign': 'off',
    'no-use-before-define': 'off',
    'no-console': 'off',
    'no-continue': 'off',
    'no-restricted-syntax': 'off',
    'no-prototype-builtins': 'off',
    'no-unused-vars': 'off',
    'max-len': ['error', 200],
    'no-param-reassign': 'off',
    'prefer-destructuring': 'off',
    'import/extensions': 'off',
    'no-useless-escape': 'off',
    'no-mixed-operators': 'off',
    'import/no-unresolved': 'off',
    'no-underscore-dangle': 'off',
    'import/no-mutable-exports': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
};
