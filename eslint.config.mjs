import js from '@eslint/js'
import globals from 'globals'
import stylistic from '@stylistic/eslint-plugin'

import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.node },
    plugins: { js, stylistic },
    extends: ['js/recommended'],
    rules: {
      'stylistic/quotes': ['error', 'single'],
      'stylistic/semi': ['error', 'always'],
      'stylistic/indent': ['error', 2],
      'stylistic/no-trailing-spaces': ['error'],
      'stylistic/space-before-blocks': ['error', 'always'],
      'stylistic/space-in-parens': ['error', 'never'],
      'stylistic/space-infix-ops': ['error', { int32Hint: false }],
      'stylistic/keyword-spacing': ['error', { before: true, after: true }],
      'stylistic/comma-spacing': ['error', { before: false, after: true }],
      'stylistic/object-curly-spacing': ['error', 'always'],
      'stylistic/array-bracket-spacing': ['error', 'never'],
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': [
        'error', { 'before': true, 'after': true }
      ],
      'no-console': 0
    }

  },

  globalIgnores(['./dist/'])
])