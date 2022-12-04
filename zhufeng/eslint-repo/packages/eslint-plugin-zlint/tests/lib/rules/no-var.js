/**
 * @fileoverview 项目中不能有var关键字
 * @author zi-shui
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-var"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 'latest'
  }
});
ruleTester.run("no-var", rule, {
  valid: [
    { code: "let a = 1" }
  ],

  invalid: [
    {
      code: "var a = 1",
      errors: [{ message: "不能用 var " }],
      output: 'let a = 1'
    },
  ],
});
