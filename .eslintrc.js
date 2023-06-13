module.exports = {
  "env": {
    "node": true,
    "commonjs": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "windows"
    ],
    "quotes": [
      "error",
      "double"
    ],
    "eqeqeq": "error",
    "no-console": "off",
    "object-curly-spacing": ["error", "always"],
    "arrow-spacing": [
      "error", { "before": true, "after": true }
    ]
    // "no-trailing-spaces": "error",
    // 'semi': [
    // 	'error',
    // 	'never'
    // ]
  }
}
