module.exports = {
  "extends": "eslint:recommended",
  "rules": {
      
    "react-hooks/exhaustive-deps": ["warn", {
      "additionalHooks": "useStateHandler"
    }]
  }
}