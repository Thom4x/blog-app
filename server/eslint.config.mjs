import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["dist/**", "build/**", "node_modules/**", "coverage/**"],
  },

  js.configs.recommended,


  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module", 
      globals: {
        ...globals.node,    
        ...globals.browser, 
      },
    },
    rules: {
      "eqeqeq": "error",                  
      "no-unused-vars": ["error", { args: "none" }], 
      "no-console": "off",                         
    },
  },
]);