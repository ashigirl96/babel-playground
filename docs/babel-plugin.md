# Babel

## AST入門

- `1 + 2`は以下のようになる
  - ![image-20200912160649314](/Users/reon.nishimura/Library/Application Support/typora-user-images/image-20200912160649314.png)

- ```typescript
  interface SourceFile {
  	statements: Statement[];  
  }
  
  type Statements = 'VariableState' | 'ExpressionStatement' | 'FunctionDeclaration' | ... | 'ReturnStatement';
  
  interface VariableState {
    declarationList: declarations;
  }
  
  type declrations = VariableDeclaration[];
  
  interface VariableDecaration { // 変数定義
    name: Identifier; // 変数名
    type: NumberKeyword; // 変数型
    initializer: 'NumberLitera' | 'ArrowFunction' ; // 変数値
  }
  
  }
  ```

- みたいな感じ



- JSにおけるASTはESTree仕様になった。

  - ```typescript
    extend interface Program {
      sourceType: "script" | "module";
      body: [ Statement | ModuleDeclaration ];
    }
    ```

- parsing: `@babel/parser`を使ってソースコードをASTに変換する
- Transformation: `@babel/traverse`を使って、ASTを別のASTに変換する
- Code Generator: `@babel/generator`を使って、ASTをソースコードに変換する

<img src="/Users/reon.nishimura/Library/Application Support/typora-user-images/image-20200912174545492.png" alt="image-20200912174545492" style="zoom:50%;" />

### Traverse

```typescript
const code = `
const a = 1
console.log("test");
let b = 2
`;

// parse
const ast = parse(code);

// generation
const identity_output = generate(ast).code;

traverse(ast, {
    VariableDeclaration(path) {
        console.log(path.node);
        path.node.kind = "var";
    },
});

// generateの第一引数にASTを格納し、コードを生成
console.log(generate(ast).code);
```

出力

```typescript
Node {
  type: 'VariableDeclaration',
  kind: 'const'    
  start: 1,
  end: 12,
  loc: SourceLocation {
    start: Position { line: 2, column: 0 },
    end: Position { line: 2, column: 11 }
  },
  declarations: [
    Node {
      type: 'VariableDeclarator',
      start: 7,
      end: 12,
      loc: [SourceLocation],
      id: [Node],
      init: [Node]
    }
  ],
}
Node {
  type: 'VariableDeclaration',
  kind: 'let'
  start: 85,
  end: 94,
  loc: SourceLocation {
    start: Position { line: 7, column: 0 },
    end: Position { line: 7, column: 9 }
  },
  declarations: [
    Node {
      type: 'VariableDeclarator',
      start: 89,
      end: 94,
      loc: [SourceLocation],
      id: [Node],
      init: [Node]
    }
  ],
}
var a = 1;
```

- `path.node`を出力すると分かる通り、`VariableDeclaration`の`kind`には`const`や`let`が入っている。では、これはどこで定義されてるのか

  - [ESTree#variableDeclaration](https://github.com/estree/estree/blob/master/es2015.md#variabledeclaration)に載ってる

  - ```typescript
    extend interface VariableDeclaration {
        kind: "var" | "let" | "const";
    }
    ```

    

- 例えば、関数の呼び出しは以下の通り。だとすれば、

  - ```typescript
    extend interface CallExpression {
        callee: Expression | Super;
    }
    
    Node {
      type: 'CallExpression',
      callee: Node {
        type: 'MemberExpression',
        object: Node {
          type: 'Identifier',
          start: 67,
          end: 74,
          loc: [SourceLocation],
          name: 'console'
        },
        property: Node {
          type: 'Identifier',
          name: 'log'
        }
      },
      arguments: [
        Node {
          type: 'Identifier',
          name: 'x'
        }
      ]
    }
    ```

    - `console.log(x)` を`parse`するとこうなる。`path.node.callee.property.name = "dumn"`とかにすると
    - `console.dumn(x)`となる

  -  

