module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict",
  ],
  plugins: ["@typescript-eslint/eslint-plugin", "import"],
  env: {
    node: true,
    es6: true,
    mocha: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    project: "tsconfig.json",
  },
  rules: {
    semi: ["off"],
    eqeqeq: "error",
    quotes: [
      "error",
      "double",
      { allowTemplateLiterals: true, avoidEscape: false },
    ],
    "prefer-const": "error",
    "no-console": "error",
    "linebreak-style": ["error", "unix"],
    "comma-dangle": ["warn", "only-multiline"],
    // do not allow relative path import. only import from @app/*
    "no-restricted-imports": ["error", { patterns: ["./*", "../*"] }],
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      { allowExpressions: true },
    ],
    "@typescript-eslint/no-explicit-any": 1,
    "@typescript-eslint/semi": ["error", "always"],
    "@typescript-eslint/explicit-member-accessibility": ["error"],
    "@typescript-eslint/no-inferrable-types": [
      "warn",
      {
        ignoreParameters: true,
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    // "@typescript-eslint/member-ordering": ["error"],
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "import/no-default-export": 2,
    "@typescript-eslint/no-unnecessary-type-assertion": ["error"],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: [
          "variable",
          "classProperty",
          "function",
          "parameter",
          "typeProperty",
          "parameterProperty",
          "classMethod",
          "objectLiteralMethod",
          "typeMethod",
          "accessor",
        ],
        format: ["camelCase"],
        leadingUnderscore: "allow",
      },
      {
        selector: [
          "class",
          "interface",
          "enum",
          "enumMember",
          "typeAlias",
          "typeParameter",
        ],
        format: ["PascalCase"],
      },
    ],
  },
  ignorePatterns: [".eslintrc.js", "tsconfig*.json"],
};
