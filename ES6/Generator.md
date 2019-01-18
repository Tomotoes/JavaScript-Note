Generator ：状态机，遍历器
yield: 定义多个内部状态，同时还具有暂停函数执行的功能。

* yield: 用来将一个Generator放到另一个Generator函数中执行。 有点像[...]的功能：
如果yield*后面跟着一个数组，由于数组原生支持遍历器，因此就会遍历数组成员。
实际上，任何数据结构只要有 Iterator 接口，就可以被yield*遍历。
```js
function* iterTree(tree) {
  if (Array.isArray(tree)) {
    for(let i=0; i < tree.length; i++) {
      yield* iterTree(tree[i]);
    }
  } else {
    yield tree;
  }
}

const tree = [ 'a', ['b', 'c'], ['d', 'e'] ];

for(let x of iterTree(tree)) {
  console.log(x);
}
```

调用Generator函数的时候，不会立即执行，而是返回遍历器对象。

遍历器对象的原型对象上具有next方法，可以通过next方法恢复函数的执行。
每次调用next方法，都会在遇到yield表达式时停下来，再次调用的时候，会在停下的位置继续执行。

调用next方法会返回具有value和done属性的对象，value属性表示当前的内部状态，可能的值有yield表达式后面的值、return语句后面的值和undefined；
done属性表示遍历是否结束。

yield表达式默认是没有返回值的，或者说，返回值为undefined。
因此，想要获得yield表达式的返回值，就需要给next方法传递参数。
next方法的参数表示上一个yield表达式的返回值。
因此在调用第一个next方法时可以不传递参数(即使传递参数也不会起作用)，此时表示启动遍历器对象。
所以next方法会比yield表达式的使用要多一次。

遍历器对象的next方法的运行逻辑如下。

（1）遇到yield表达式，就暂停执行后面的操作，并将紧跟在yield后面的那个表达式的值，作为返回的对象的value属性值。

（2）下一次调用next方法时，再继续往下执行，直到遇到下一个yield表达式。

（3）如果没有再遇到新的yield表达式，就一直运行到函数结束，直到return语句为止，并将return语句后面的表达式的值，作为返回的对象的value属性值。

（4）如果该函数没有return语句，则返回的对象的value属性值为undefined。

需要注意的是，yield表达式后面的表达式，只有当调用next方法、内部指针指向该语句时才会执行，
因此等于为 JavaScript 提供了手动的“惰性求值”（Lazy Evaluation）的语法功能。


yield表达式如果用在另一个表达式之中，必须放在圆括号里面
console.log('Hello' + (yield)); // OK

next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值。

V8 引擎直接忽略第一次使用next方法时的参数，只有从第二次使用next方法开始，参数才是有效的。
从语义上讲，第一个next方法用来启动遍历器对象，所以不用带有参数。


Generator 遍历器API
1. next
2. return
可以返回给定的值，并且终结遍历 Generator 函数。
如果 Generator 函数内部有try...finally代码块，那么return方法会推迟到finally代码块执行完再执行。

3. throw
g.throw抛出错误以后，没有任何try...catch代码块可以捕获这个错误，导致程序报错，中断执行。

**坑点**
throw方法被捕获以后，会附带执行下一条yield表达式。也就是说，会附带执行一次next方法。


```js
function* Method(){
  yield xxx
}

const status = Method()
status.next()

for(let i of Method()){
  console.log(i)
}
```
next总会返回一个对象，包含两个属性值：
value：yield关键字后边表达式的值
done ：如果已经没有yield关键字了，则会返回true .

如果想要第一次调用 next 方法，就能够输入值，可以在 Generator 函数外面包一层
```js
function wrapper(generatorFunction){
  return function(...args){
    let generatorObject = generatorFunction(...args)
    generatorObject.next()
    return generatorObject
  }
}
const wrapped = wrapper(function* (){
  console.log(`First input: ${yield}`)
  return 'DONE'
})

wrapped().next('hello')
```

### API
1. generator.next()
2. generator.return()来终止后续的代码执行。
3. generator.throw()在调用throw()后同样会终止所有的yield执行，同时会抛出一个异常，需要通过try-catch来接收

yield*
yield*用来将一个Generator放到另一个Generator函数中执行。
有点像[...]的功能：
```js
function * gen1 () {
  yield 2
  yield 3
}

function * gen2 () {
  yield 1
  yield * gen1()
  yield 4
}

let gen = gen2()

gen.next().value // 1
gen.next().value // 2
gen.next().value // 3
gen.next().value // 4

let collection = {
  items: [],
  *[Symbol.iterator]() {
    for (let item of this.items) {
      yield item;
    }
  }
};

```

而yield的表现则不一样
```js
function * yieldMethod(a) {
  let b = 5
  yield a + b
  // 在执行第二次`next`时，下边两行则会执行
  b = 6
  return a * b
}

const gen = yieldMethod(6)
gen.next().value // 11
gen.next().value // 36
```

### Generator 应用
```js
1. 异步操作的同步化表达
function* loadUI() {
  showLoadingScreen();
  yield loadUIDataAsynchronously();
  hideLoadingScreen();
}
let loader = loadUI();
// 加载UI
loader.next()

// 卸载UI
loader.next()

<!-- Ajax -->
function* main() {
  let result = yield request("http://some.url");
  let resp = JSON.parse(result);
    console.log(resp.value);
}

function request(url) {
  makeAjaxCall(url, function(response){
    it.next(response);
  });
}

let it = main();
it.next();

<!-- 读取文件 -->
function* numbers() {
  let file = new FileReader("numbers.txt");
  try {
    while(!file.eof) {
      yield parseInt(file.readLine(), 10);
    }
  } finally {
    file.close();
  }
}

<!-- 控制流 -->
let steps = [step1Func, step2Func, step3Func];

function* iterateSteps(steps){
  for (let i=0; i< steps.length; i++){
    let step = steps[i];
    yield step();
  }
}

<!-- 部署 Iterator 接口 -->
function* iterEntries(obj) {
  let keys = Object.keys(obj);
  for (let i=0; i < keys.length; i++) {
    let key = keys[i];
    yield [key, obj[key]];
  }
}

let myObj = { foo: 3, bar: 7 };

for (let [key, value] of iterEntries(myObj)) {
  console.log(key, value);
}

<!-- Generator 与 构造函数有机结合 -->
function* gen() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}

function F() {
  return gen.call(gen.prototype);
}

let f = new F();

f.next();  // Object {value: 2, done: false}
f.next();  // Object {value: 3, done: false}
f.next();  // Object {value: undefined, done: true}

f.a // 1
f.b // 2
f.c // 3

function* makeSimpleGenerator(array){
  let nextIndex = 0;

  while(nextIndex < array.length){
    yield array[nextIndex++];
  }
}

let gen = makeSimpleGenerator(['yo', 'ya']);

gen.next().value // 'yo'
gen.next().value // 'ya'
gen.next().done  // true
```


Generator 函数有多种理解角度。
语法上，首先可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态。

执行 Generator 函数会返回一个遍历器对象，也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。
返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。

形式上，Generator 函数是一个普通函数，但是有两个特征。
一是，function关键字与函数名之间有一个星号；
二是，函数体内部使用yield表达式，定义不同的内部状态（yield在英语里的意思就是“产出”）。

```js
const myIterable = {};
myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};

[...myIterable] // [1, 2, 3]
```