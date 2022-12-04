/**
 * @fileoverview 我自己定义着玩的插件
 * @author zi-shui
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------


// import all rules in lib/rules
module.exports = {
    rules: requireIndex(__dirname + "/rules"),
    configs: {
        recommended: {
            plugins: ['zlint'],
            rules: {
                'zlint/no-var': ["error"]
            }
        }
    },
    processors: {
        '.vue': {
            preprocess(code) { // 提取.vue 文件中的js
                console.log(code, '----'); // 将.vue 文件中的js提取后返回
                return [code] // 校验提取后的js代码
            },
            postprocess(messages) {
                console.log(messages)
                return []
            }
        }
    }
}


