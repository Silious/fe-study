/**
 * @fileoverview 项目中不能有var关键字
 * @author zi-shui
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "项目中不能有var关键字",
    },
    fixable: 'code', // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      unexpected: '不能用 {{type}} '
    }
  },

  create(context) {
    // https://eslint.bootcss.com/docs/developer-guide/working-with-rules

    const sourceCode = context.getSourceCode(); // 要用这个来修复代码


    return {
      VariableDeclaration(node) {
        if (node.kind == 'var') { // var
          context.report({
            node,
            data: { type: 'var' },
            messageId: 'unexpected',
            fix(fixer) {
              const varToken = sourceCode.getFirstToken(node, { filter: t => t.value === 'var' })
              console.log(varToken)
              return fixer.replaceText(varToken, 'let')
            }
          })
        }

      }
    };
  },
};
