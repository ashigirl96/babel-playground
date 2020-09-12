import {parse} from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";

const code = `
const a = 1
console.log("test");
for (let x = 0; x < 10; x++) {
  console.log(x);
}
let b = 2
`;

// parse
const ast = parse(code);

// generation
const identity_output = generate(ast).code;

traverse(ast, {
    VariableDeclaration(path) {
        path.node.kind = "var";
    },
    CallExpression: (path) => {
        console.log(path.node);
        path.node.callee.property.name = "dumn";
    },
});

// generateの第一引数にASTを格納し、コードを生成
console.log(generate(ast).code);

console.log(1 + 2 / 3 % 4);