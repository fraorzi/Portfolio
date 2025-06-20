import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import better from 'eslint-plugin-better-tailwindcss';
import jsxA11y from 'eslint-plugin-jsx-a11y';

// Extract recommended better-tailwindcss settings and rules
const { rules: betterRules, settings: betterSettings } =
  better.configs.recommended;

export default tseslint.config(
  { ignores: ['dist'] },
  {
    // Base ESLint recommended configs
    extends: [js.configs.recommended, ...tseslint.configs.recommended],

    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },

    // Register plugins
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'better-tailwindcss': better,
      'jsx-a11y': jsxA11y,
    },

    // Merge rules from React Hooks and Better-Tailwindcss
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      ...betterRules,
      ...jsxA11y.configs.recommended.rules,
    },

    // Combine Better-Tailwindcss settings with entryPoint override
    settings: {
      ...betterSettings,
      'better-tailwindcss': {
        entryPoint: 'src/index.css',
      },
    },
  },
);
