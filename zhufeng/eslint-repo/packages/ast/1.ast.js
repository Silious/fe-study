const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
let code = `function a(){}`;

// 1) 就是将我们的代码转换成ast语法树
const ast = esprima.parseScript(code);

// 访问模式 就是遍历节点的时候 会有两个过程 1个是进入一个是离开
estraverse.traverse(ast, {
    enter(node) { // Program ->  FunctionDeclaration -> Identifier
        console.log('enter:' + node.type)
        if (node.type === 'FunctionDeclaration') {
            node.id.name = 'ast'
        }
    },
    leave(node) {
        console.log('leave:' + node.type)
    }
})
console.log(escodegen.generate(ast))


