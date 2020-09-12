import {transform, types} from "@babel/core";

const src = "1 + 2";

const visitor = {
    BinaryExpression: (nodePath) => {
        if (nodePath.node.operator !== "*") {
            const newAst = types.binaryExpression("*", nodePath.node.left, nodePath.node.right);
            nodePath.replaceWith(newAst);
        }
    }
}

const plugin = () => ({visitor});
// const {code} = transform(src, {plugins: [plugin]});
// console.log(code);

export default plugin;
