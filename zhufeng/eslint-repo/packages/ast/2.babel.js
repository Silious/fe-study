// es6-> es5语法 典型的语法转化 将箭头函数转换成普通函数  @babel/core(可以放入对应的babel插件，默认在转化的时候可以调用这些插件)

const babel = require('@babel/core');
const types = require('@babel/types');
//
const transformFunction = {
    visitor: {
        ArrowFunctionExpression(path) { // path就是访问的路径   path -> node
            let { node } = path;
            node.type = 'FunctionExpression';

            hoistFunctionEvn(path);
            let body = node.body; // 老节点中的 a+b;

            if (!types.isBlockStatement(body)) {
                node.body = types.blockStatement([types.returnStatement(body)])
            }
        }
    }
}
function getThisPath(path) {
    let arr = []
    path.traverse({
        ThisExpression(path) {
            arr.push(path);
        }
    })
    return arr;
}
function hoistFunctionEvn(path) {
    // 查找父作用域
    const thisEnv = path.findParent((parent) => (parent.isFunction() && !parent.isArrowFunctionExpression()) || parent.isProgram())

    const bingingThis = '_this'; // var _this = this;

    const thisPaths = getThisPath(path);

    // 1) 修改当前路径中的this  变为_this
    thisPaths.forEach(path => {
        // this -> _this
        path.replaceWith(types.identifier(bingingThis))
    })
    thisEnv.scope.push({
        id: types.identifier(bingingThis),
        init: types.thisExpression()
    })

}
const code = ` const sum = ()=> console.log(this)`; // js代码  
const result = babel.transform(code, {
    plugins: [transformFunction]
})

console.log(result.code)

// 老代码 ->   ast
// 最终的结果 -> ast
// 将ast进行转化，最终生成结果