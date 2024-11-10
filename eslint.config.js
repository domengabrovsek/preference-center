import globals from 'globals';
import pluginJs from '@eslint/js';
import * as tseslint from 'typescript-eslint';

export default tseslint.config(
  // recommended javascript rules
  pluginJs.configs.recommended,

  // recommended typescript rules
  ...tseslint.configs.recommended,

  {
    // additional linting rules
    rules: {
      'no-console': 'error',
    },

    // lint only typescript files
    files: ['**/*.ts'],

    // language options
    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: 2024,
      parser: tseslint.parser,
      parserOptions: {
        project: true,
      },
    },

    // ignore node_modules and any compiled files
    ignores: ['node_modules/**', '**/*.{m,c}js', '**/*.d.ts'],
  },
);
