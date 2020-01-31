
浏览器加载 ES6 模块，也使用 script 标签，但是要加入 **type="module"** 属性
当然还有 nomodule属性 script(nomodule)

浏览器对于带有type="module"的<script>，都是异步加载，不会造成堵塞浏览器，即等到整个页面渲染完，再执行模块脚本，
等同于打开了<script>标签的defer属性。

支持 type=module 的浏览器将会忽略带有 nomodule 属性的 script 标签。
这意味着我们可以为支持模块的浏览器提供模块形式的代码，同时为那些不支持模块的浏览器提供降级处理。

与正常脚本不同，模块脚本（及其引入的脚本）是通过 CORS 获取的。
这意味着，跨域模块脚本必须返回类似 Access-Control-Allow-Origin: * 这样的有效的响应头。

<!-- 会携带相关凭证 -->
<script type="module" crossorigin src="1.js?"></script>

<!-- 不会携带相关凭证 -->
<script type="module" crossorigin src="https://other-origin/1.js"></script>

<!-- 会携带相关凭证-->
<script type="module" crossorigin="use-credentials" src="https://other-origin/1.js?"></script>



对于外部的模块脚本（上例是foo.js），有几点需要注意。
1. .js后缀不可省略
2. 顶层的this关键字返回undefined，而不是指向window。
3. 自动采用严格模式
4. 代码是在模块作用域之中运行，而不是在全局作用域运行。模块内部的顶层变量，外部不可见。


利用顶层的this等于undefined这个语法点，可以侦测当前代码是否在 ES6 模块之中。
const isNotModuleScript = this !== undefined;



CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

下面重点解释第一个差异。
CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。

ES6 模块的运行机制与 CommonJS 不一样。
JS 引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用。
等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。
换句话说，ES6 的import有点像 Unix 系统的“符号连接”，原始值变了，import加载的值也会跟着变。
因此，ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。
**只读**
```js
// lib.js
let counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};

// main.js
let mod = require('./lib');

console.log(mod.counter);  // 3
mod.incCounter();
console.log(mod.counter); // 3

// m1.js
export let foo = 'bar';
setTimeout(() => foo = 'baz', 500);

// m2.js
import {foo} from './m1.js';
console.log(foo);
setTimeout(() => console.log(foo), 500);

$ babel-node m2.js

bar
baz
```

Node 要求 ES6 模块采用.mjs后缀文件名。
也就是说，只要脚本文件里面使用import或者export命令，那么就必须采用.mjs后缀名。
require命令不能加载.mjs文件，会报错，只有import命令才可以加载.mjs文件。
反过来，.mjs文件里面也不能使用require命令，必须使用import。

目前，这项功能还在试验阶段。安装 Node v8.5.0 或以上版本，要用--experimental-modules参数才能打开该功能。
$ node --experimental-modules my-app.mjs

目前，Node 的import命令只支持加载本地模块（file:协议），不支持加载远程模块。

如果模块名不含路径，那么import命令会去node_modules目录寻找这个模块。

如果脚本文件省略了后缀名，比如import './foo'，Node 会依次尝试四个后缀名：./foo.mjs、./foo.js、./foo.json、./foo.node

如果这些脚本文件都不存在，Node 就会去加载./foo/package.json的main字段指定的脚本。
如果./foo/package.json不存在或者没有main字段，

那么就会依次加载./foo/index.mjs、./foo/index.js、./foo/index.json、./foo/index.node。
如果以上四个文件还是都不存在，就会抛出错误。

ES6 模块之中，顶层的this指向undefined；CommonJS 模块的顶层this指向当前模块，这是两者的一个重大差异。

其次，以下这些顶层变量在 ES6 模块之中都是不存在的。

arguments
require
module
exports
__filename
__dirname



### defer async 的区别
defer要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），才会执行；
async一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。
一句话，defer是“渲染完再执行”，async是“下载完就执行”。
另外，如果有多个defer脚本，会按照它们在页面出现的顺序加载，而多个async脚本是不能保证加载顺序的。

script(type="module")
除了IE 主流浏览器已实现

import()类似于 Node 的require方法，区别主要是前者是异步加载，后者是同步加载。
目前 Chrome 浏览器已经实现，其余还未支持
```js
const main = document.querySelector('main');

import(`./section-modules/${someVariable}.js`)
  .then(module => {
    module.loadPageInto(main);
  })
  .catch(err => {
    main.textContent = err.message;
  });

<!-- 按需加载 -->
button.addEventListener('click', event => {
  import('./dialogBox.js')
  .then(dialogBox => {
    dialogBox.open();
  })
  .catch(error => {
    /* Error handling */
  })
});

<!-- 条件加载 -->
if (condition) {
  import('moduleA').then(...);
} else {
  import('moduleB').then(...);
}

<!-- 动态 -->
import('./myModule.js')
.then(({export1, export2}) => {
  // ...·
});

async function main() {
  const myModule = await import('./myModule.js');
  const {export1, export2} = await import('./myModule.js');
  const [module1, module2, module3] =
    await Promise.all([
      import('./module1.js'),
      import('./module2.js'),
      import('./module3.js'),
    ]);
}
main();

```

由于 ES6 模块是编译时加载，使得静态分析成为可能。
有了它，就能进一步拓宽 JavaScript 的语法，比如引入宏（macro）和类型检验（type system）这些只能靠静态分析实现的功能。

ES6 的模块自动采用严格模式

严格模式主要有以下限制。

变量必须声明后再使用
函数的参数不能有同名属性，否则报错
不能使用with语句
不能对只读属性赋值，否则报错
不能使用前缀 0 表示八进制数，否则报错
不能删除不可删除的属性，否则报错
不能删除变量delete prop，会报错，只能删除属性delete global[prop]
eval不会在它的外层作用域引入变量
eval和arguments不能被重新赋值
arguments不会自动反映函数参数的变化
不能使用arguments.callee
不能使用arguments.caller
禁止this指向全局对象
不能使用fn.caller和fn.arguments获取函数调用的堆栈
增加了保留字（比如protected、static和interface）

通常情况下，export输出的变量就是本来的名字，但是可以使用as关键字重命名。
```js
function v1() { ... }
function v2() { ... }

export {
  v1 as streamV1,
  v2 as streamV2,
  v2 as streamLatestVersion
};
```

export语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值。
export let foo = 'bar';
setTimeout(() => foo = 'baz', 500);
上面代码输出变量foo，值为bar，500 毫秒之后变成baz。

export命令可以出现在模块的任何位置，只要处于模块顶层就可以。
如果处于块级作用域内，就会报错，下一节的import命令也是如此。
这是因为处于条件代码块之中，就没法做静态优化了，违背了 ES6 模块的设计初衷。

如果想为输入的变量重新取一个名字，import命令要使用as关键字，将输入的变量重命名。
import { lastName as surname } from './profile.js';

import命令输入的变量都是只读的，因为它的本质是输入接口。

注意，import命令具有提升效果，会提升到整个模块的头部，首先执行。

由于import是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构。

如果多次重复执行同一句import语句，那么只会执行一次，而不会执行多次。

```js
// modules.js
function add(x, y) {
  return x * y;
}
export {add as default};
// 等同于
// export default add;

// app.js
import { default as foo } from 'modules';
// 等同于
// import foo from 'modules';

import _, { each, each as forEach } from 'lodash';
export default function (obj) {
  // ···
}

export function each(obj, iterator, context) {
  // ···
}

export { each as forEach };
```

如果在一个模块之中，先输入后输出同一个模块，import语句可以与export语句写在一起。
```js
export { foo, bar } from 'my_module';

// 可以简单理解为
import { foo, bar } from 'my_module';
export { foo, bar };

// 接口改名
export { foo as myFoo } from 'my_module';

// 整体输出
export * from 'my_module';

export { es6 as default } from './someModule';

// 等同于
import { es6 } from './someModule';
export default es6;
```


defer是“渲染完再执行”，async是“下载完就执行”。