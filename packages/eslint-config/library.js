const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "airbnb-typescript",
    "prettier",
    "eslint-config-turbo",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  plugins: ["@typescript-eslint", "import", "react", "react-hooks", "prettier"],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
    "dist/",
  ],
  overrides: [
    {
      files: ["*.js?(x)", "*.ts?(x)"],
    },
  ],
  rules: {
    "prettier/prettier": "error",
    "import/order": "error",
  },
};
