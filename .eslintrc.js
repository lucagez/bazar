module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "mocha": true
    },
    "extends": "airbnb-base",
    "rules": {
        "arrow-parens": "off",
        "no-return-assign": "off",
        "no-underscore-dangle": "off",
        "no-param-reassign": "off",
        "no-nested-ternary": "off",
        "no-use-before-define": "off",
        "no-restricted-globals": "off",
        "no-prototype-builtins": "off"
    },
    "globals": {
        "_store_": true,
        "browser": true
    }
};