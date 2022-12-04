module.exports = {
    "env": { // 我当前可以使用哪个环境的全局变量 
        "browser": true,
        "es2021": true,
        "node": true
    },
    // extends 和 plugin的区别
    // "extends": [
    //     "eslint:recommended",
    //     // "plugin:@typescript-eslint/recommended"
    // ], // 如果集成后 就可以使用别人写好的的规则
    "parserOptions": {
        "ecmaVersion": "latest",// 这个是描述语法的
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    // "rules": {
    //     // 0 off 1 warn 2 error
    //     "quotes": ["error", "double"], // 这个是覆盖掉了之前集成的规则
    //     // "@typescript-eslint/no-inferrable-types": "error"
    // },
    // ts 解析器
    // plugins: ['@typescript-eslint'],
    // parser: '@typescript-eslint/parser',//内部用的是espress

    extends: ['plugin:zlint/recommended'],

    // extends = plugin + rule
    globals: {
        // custom: "readonly"
        custom: "writable"
    },

    // extends = plugin + rule
}
