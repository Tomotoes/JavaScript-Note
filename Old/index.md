~~数值 向下取整

arr.sort(compareFunction)
如果没有指明 compareFunction ，那么元素会按照转换为的字符串的诸个字符的Unicode位点进行排序。
```js
[1,3,100].sort() => [1,100,3]

<!-- 升序 -->
[1,3,100].sort((a,b)=>a-b)

<!-- 降序 -->
[1,3,100].sort((a,b)=>b-a)
```


1. 类的修饰
修饰器函数的第一个参数，就是所要修饰的目标类。
如果觉得一个参数不够用，可以在修饰器外面再封装一层函数。
修饰器对类的行为的改变，是代码编译时发生的，而不是在运行时。这意味着，修饰器能在编译阶段运行代码。也就是说，修饰器本质就是编译时执行的函数。
```js
// mixins.js
export function mixins(...list) {
  return function (target) {
    Object.assign(target.prototype, ...list)
  }
}

// main.js
import { mixins } from './mixins'

const Foo = {
  foo() { console.log('foo') }
};

@mixins(Foo)
class MyClass {}

let obj = new MyClass();
obj.foo() // 'foo'
```

2. 方法的修饰
修饰器函数一共可以接受三个参数
- target,类的原型对象
- name,所要修饰的属性名
- descriptor 该属性的描述对象
需要返回 该属性的描述对象，也就是第三个参数

如果同一个方法有多个修饰器，会像剥洋葱一样，先从外到内进入，然后由内向外执行。

从长期来看，它将是 JavaScript 代码静态分析的重要工具。
```js
class Math{
  @log
  add(a,b){
    return a+b
  }
}
function log(target,name,descriptor){
  const oldValue = descriptor.value
  descriptor.value = function(){
    console.log(`Calling ${name} with`, arguments)
    return oldValue.apply(this,arguments)
  }
  return descriptor
}
const math = new Math();

// passed parameters should get logged now
math.add(2, 4);
```

修饰器只能用于类和类的方法，不能用于函数，因为存在函数提升。
如果一定要修饰函数，可以采用高阶函数的形式直接执行。
```js
function doSomething(name) {
  console.log('Hello, ' + name);
}

function loggingDecorator(wrapped) {
  return function() {
    console.log('Starting');
    const result = wrapped.apply(this, arguments);
    console.log('Finished');
    return result;
  }
}

const wrapped = loggingDecorator(doSomething);
```


```js
let MyMixin = (superclass) => class extends superclass {
  foo() {
    console.log('foo from MyMixin');
  }
};
这个类具有foo方法，并且继承了MyBaseClass的所有方法，然后MyClass再继承这个类。

class MyClass extends MyMixin(MyBaseClass) {
  /* ... */
}

let c = new MyClass();
c.foo(); // "foo from MyMixin"

如果需要“混入”多个方法，就生成多个混入类。

class MyClass extends Mixin1(Mixin2(MyBaseClass)) {
  /* ... */
}
```

for循环还有一个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域。
```js
for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);
}
// abc
// abc
// abc
```
上面代码正确运行，输出了 3 次abc。这表明函数内部的变量i与循环变量i不在同一个作用域，有各自单独的作用域。


### let 
1. 不存在变量提升
> 所声明的变量一定要在声明后使用，否则报错。

2. **暂时性死区**
> 只要块级作用域内存在let命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响。

3. 不允许重复声明 
> 不允许在相同作用域内，重复声明同一个变量。

ES5 只有 **全局作用域和函数作用域**，没有块级作用域，这带来很多不合理的场景。
第一种场景，内层变量可能会覆盖外层变量。
第二种场景，用来计数的循环变量泄露为全局变量。

let实际上为 JavaScript 新增了块级作用域。

ES6 允许块级作用域的任意嵌套。

外层作用域无法读取内层作用域的变量。

{{{{{let insane = 'Hello World'}}}}};

内层作用域可以定义外层作用域的同名变量。

{{{{
  let insane = 'Hello World';
  {let insane = 'Hello World'}
}}}};

块级作用域的出现，实际上使得获得广泛应用的立即执行函数表达式（IIFE）不再必要了。

// IIFE 写法
(function () {
  var tmp = ...;
  ...
}());

// 块级作用域写法
{
  let tmp = ...;
  ...
}

ES5 规定，函数只能在顶层作用域和函数作用域之中声明，不能在块级作用域声明。

ES6 引入了块级作用域，**明确允许在块级作用域之中声明函数。**
ES6 规定，块级作用域之中，函数声明语句的行为类似于let，在块级作用域之外不可引用。

  允许在块级作用域内声明函数。
  函数声明类似于var，即会提升到全局作用域或函数作用域的头部。
  同时，函数声明还会提升到所在的块级作用域的头部。

```js
function f() { console.log('I am outside!'); }

(function () {
  if (false) {
    // 重复声明一次函数f
    function f() { console.log('I am inside!'); }
  }

  f();
}());
“I am inside!”
因为在if内声明的函数f会被提升到函数头部，实际运行的代码如下。
// ES5 环境
function f() { console.log('I am outside!'); }

(function () {
  function f() { console.log('I am inside!'); }
  if (false) {
  }
  f();
}());

// 浏览器的 ES6 环境
function f() { console.log('I am outside!'); }
(function () {
  var f = undefined;
  if (false) {
    function f() { console.log('I am inside!'); }
  }

  f();
}());
// Uncaught TypeError: f is not a function

```
另外，还有一个需要注意的地方。
ES6 的块级作用域允许声明函数的规则，**只在使用大括号的情况下成立**，如果没有使用大括号，就会报错。
```js
// 不报错
'use strict';
if (true) {
  function f() {}
}

// 报错
'use strict';
if (true)
  function f() {}
```

顶层对象的属性与全局变量挂钩，被认为是 JavaScript 语言最大的设计败笔之一。

这样的设计带来了几个很大的问题，首先是没法在编译时就报出变量未声明的错误，只有运行时才能知道
（因为全局变量可能是顶层对象的属性创造的，而属性的创造是动态的）；

其次，程序员很容易不知不觉地就创建了全局变量（比如打字出错）；
最后，顶层对象的属性是到处可以读写的，这非常不利于模块化编程。
另一方面，window对象有实体含义，指的是浏览器的窗口对象，顶层对象是一个有实体含义的对象，也是不合适的。

ES6 为了改变这一点，一方面规定，为了保持兼容性，var命令和function命令声明的全局变量，依旧是顶层对象的属性；
另一方面规定，let命令、const命令、class命令声明的全局变量，不属于顶层对象的属性。
也就是说，从 ES6 开始，全局变量将逐步与顶层对象的属性脱钩。
```js
var a = 'a'
window.a //a

function b(){}
window.b // func...

let c = 'c'
window.c //undefined
```

ES5 的顶层对象，本身也是一个问题，因为它在各种实现里面是不统一的。

浏览器里面，顶层对象是window，但 Node 和 Web Worker 没有window。
浏览器和 Web Worker 里面，self也指向顶层对象，但是 Node 没有self。
Node 里面，顶层对象是global，但其他环境都不支持。

下面是目前勉强可以取到全局对象的方法
```js
// 方法一
(typeof window !== 'undefined'
   ? window
   : (typeof process === 'object' &&
      typeof require === 'function' &&
      typeof global === 'object')
     ? global
     : this);

// 方法二
const getGlobal = function () {
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
};
```


js 中的字段
```js
const obj = {
  foo:1,
  bar:2,
  get baz(){
    return this.foo + this.bar
  },
  set qx(value){
    this.bar = value
  }
}
obj.baz // 3
obj.qx = 5
obj.baz = 6
```
存取器，让 js 可以像调用属性一样 去调用方法

js 的 set函数，必须 手动声明参数，不然报错


Reflect
### 设计目的
1. 将Object对象的一些明显属于语言内部的方法（比如Object.defineProperty），放到Reflect对象上。
  现阶段，某些方法同时在Object和Reflect对象上部署，未来的新方法将只部署在Reflect对象上。
  也就是说，从Reflect对象上可以拿到语言内部的方法。

2.  修改某些Object方法的返回结果，让其变得更合理。
  比如，Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，
  而Reflect.defineProperty(obj, name, desc)则会返回false。

3. 让Object操作都变成函数行为。
  某些Object操作是命令式，比如name in obj和delete obj[name]，
  而Reflect.has(obj, name)和Reflect.deleteProperty(obj, name)让它们变成了函数行为。

4. Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。
  这就让Proxy对象可以方便地调用对应的Reflect方法，完成默认行为，作为修改行为的基础。
  也就是说，不管Proxy怎么修改默认行为，你总可以在Reflect上获取默认行为。
```js
var loggedObj = new Proxy(obj, {
  get(target, name) {
    console.log('get', target, name);
    return Reflect.get(target, name);
  },
  deleteProperty(target, name) {
    console.log('delete' + name);
    return Reflect.deleteProperty(target, name);
  },
  has(target, name) {
    console.log('has' + name);
    return Reflect.has(target, name);
  }
});
```

1. Reflect.get(target, name, receiver)
> Reflect.get方法查找并返回target对象的name属性，如果没有该属性，则返回undefined。
如果第一个参数不是对象，Reflect.get方法会报错。
传入了receiver，那么Reflect.set会触发Proxy.defineProperty拦截。
如果第一个参数不是对象，Reflect.set会报错。
```js
var myObject = {
  foo: 1,
  bar: 2,
  get baz() {
    return this.foo + this.bar;
  },
}

Reflect.get(myObject, 'foo') // 1
Reflect.get(myObject, 'bar') // 2
Reflect.get(myObject, 'baz') // 3
```

2. Reflect.set(target, name, value, receiver)
> Reflect.set方法设置target对象的name属性等于value。
```js
var myObject = {
  foo: 1,
  set bar(value) {
    return this.foo = value;
  },
}
```
3. Reflect.has(obj, name) 
对应name in obj里面的in运算符。
```js
// 旧写法
'foo' in myObject // true

// 新写法
Reflect.has(myObject, 'foo') // true
```

4. Reflect.deleteProperty(obj, name) 
> 等同于delete obj[name]
该方法返回一个布尔值。如果删除成功，或者被删除的属性不存在，返回true；删除失败，被删除的属性依然存在，返回false。

5. Reflect.construct(target, args)
等同于new target(...args)，这提供了一种不使用new，来调用构造函数的方法。
```js
// new 的写法
const instance = new Greeting('张三');

// Reflect.construct 的写法
const instance = Reflect.construct(Greeting, ['张三']);
```

6. Reflect.getPrototypeOf(obj)
> 用于读取对象的__proto__属性，对应Object.getPrototypeOf(obj)。

Reflect.getPrototypeOf和Object.getPrototypeOf的一个区别是，
如果参数不是对象，Object.getPrototypeOf会将这个参数转为对象，然后再运行，而Reflect.getPrototypeOf会报错。

7. Reflect.setPrototypeOf(obj, newProto)
> 用于设置对象的__proto__属性，返回第一个参数对象，对应Object.setPrototypeOf(obj, newProto)。
如果第一个参数不是对象，Object.setPrototypeOf会返回第一个参数本身，而Reflect.setPrototypeOf会报错。

8. Reflect.apply(func, thisArg, args)
> 等同于Function.prototype.apply.call(func, thisArg, args)，用于绑定this对象后执行给定函数。

9. Reflect.defineProperty(target, propertyKey, attributes)
> 基本等同于Object.defineProperty，用来为对象定义属性。未来，后者会被逐渐废除，请从现在开始就使用Reflect.defineProperty代替它。

10. Reflect.getOwnPropertyDescriptor(target, propertyKey) 
> 基本等同于Object.getOwnPropertyDescriptor，用于得到指定属性的描述对象，将来会替代掉后者。

11. Reflect.isExtensible (target)
> Reflect.isExtensible方法对应Object.isExtensible，返回一个布尔值，表示当前对象是否可扩展。

12. Reflect.preventExtensions(target)
> Reflect.preventExtensions对应Object.preventExtensions方法，用于让一个对象变为不可扩展。它返回一个布尔值，表示是否操作成功。

13. **Reflect.ownKeys (target)**
> 用于返回对象的所有属性，基本等同于Object.getOwnPropertyNames与Object.getOwnPropertySymbols之和。


```js
myObject.foo // 1

Reflect.set(myObject, 'foo', 2);
myObject.foo // 2

Reflect.set(myObject, 'bar', 3)
myObject.foo // 3
```

[].reduce((previousValue,currentValue,currentIndex,array)=>previousValue+currentValue,initialValue)
arr.reduce([callback, initialValue])
callback
  执行数组中每个值的函数，包含四个参数:

  previousValue
  上一次调用回调函数返回的值，或者是提供的初始值（initialValue）

  currentValue
  数组中当前被处理的元素

  currentIndex
  当前被处理元素在数组中的索引, 即currentValue的索引.如果有initialValue初始值, 从0开始.如果没有从1开始.

  array
  调用 reduce 的数组

initialValue
可选参数, 作为第一次调用 callback 的第一个参数。



Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”，即对编程语言进行编程。

Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，
因此提供了一种机制，可以对外界的访问进行过滤和改写。
Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。

ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例。

`const proxy = new Proxy(拦截对象,拦截行为)`

Proxy 对象的所有用法，都是上面这种形式，不同的只是handler参数的写法。
其中，new Proxy()表示生成一个Proxy实例，
  target参数表示所要拦截的目标对象，
  handler参数也是一个对象，用来定制拦截行为。
r
在 Proxy 代理的情况下，目标对象内部的this关键字会指向 Proxy 代理。

Proxy: 对外界的访问进行过滤和改写
相当于 对目标对象 加了一层防护，甚至可以 改变目标对象的本命

面向编程语言的编程

拦截操作，一共13种：
1. get(目标对象, 属性名, ? 当前Proxy 实例本身)
> 拦截对象属性的读取，比如proxy.foo和proxy['foo']。
  get方法可以继承。
  如果一个属性不可配置（configurable）和不可写（writable），则该属性不能被代理，通过 Proxy 对象访问该属性会报错。
​```js
const target = Object.defineProperties({}, {
  foo: {
    value: 123,
    writable: false,
    configurable: false
  },
});

const handler = {
  get(target, propKey) {
    return 'abc';
  }
};

const proxy = new Proxy(target, handler);

proxy.foo
// TypeError: Invariant check failed
```
​```js
const person = {name:'Simon'}
const proxy = new Proxy(person,{
  get(target,property,receiver){
    if(property in target){
      return target[property]
    }
    throw new ReferenceError('无此属性')
  }
})
proxy.name
proxy.sex
```

2. set(目标对象，属性名，属性值，? Proxy实例本身)
注意，如果目标对象自身的某个属性，不可写或不可配置，那么set方法将不起作用。
```js
let validator = {
  set: function(obj, prop, value) {
    if (prop === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('The age is not an integer');
      }
      if (value > 200) {
        throw new RangeError('The age seems invalid');
      }
    }

    // 对于满足条件的 age 属性以及其他属性，直接保存
    obj[prop] = value;
  }
};

let person = new Proxy({}, validator);

person.age = 100;

person.age // 100
person.age = 'young' // 报错
person.age = 300 // 报错
```

3. apply(目标对象，目标对象的上下文对象，目标对象的参数数组)
**Proxy 拦截函数**
拦截函数的调用，apply ，call
直接调用Reflect.apply方法，也会被拦截。
```js
var twice = {
  apply (target, ctx, args) {
    return Reflect.apply(...arguments) * 2;
  }
};
function sum (left, right) {
  return left + right;
};
var proxy = new Proxy(sum, twice);
proxy(1, 2) // 6
proxy.call(null, 5, 6) // 22
proxy.apply(null, [7, 8]) // 30
```

4. has(目标对象，查询属性名)
用来拦截HasProperty操作，即判断对象是否具有某个属性时，这个方法会生效。
典型的操作就是in运算符。
```js
var handler = {
  has (target, key) {
    if (key[0] === '_') {
      return false;
    }
    return key in target;
  }
};
var target = { _prop: 'foo', prop: 'foo' };
var proxy = new Proxy(target, handler);
'_prop' in proxy // false
```

5. construct(目标对象，构造函数的参数对象) 
用于拦截new命令
construct方法返回的必须是一个对象，否则会报错。
```js
var p = new Proxy(function () {}, {
  construct: function(target, args) {
    console.log('called: ' + args.join(', '));
    return { value: args[0] * 10 };
  }
});

(new p(1)).value
// "called: 1"
// 10
```

6. deleteProperty()
用于拦截delete操作，如果这个方法抛出错误或者返回false，当前属性就无法被delete命令删除。

7. defineProperty()
> 拦截了Object.defineProperty操作。

8. getOwnPropertyDescriptor()
> 拦截Object.getOwnPropertyDescriptor()，返回一个属性描述对象或者undefined。

9. getPrototypeOf()
> getPrototypeOf方法主要用来拦截获取对象原型。具体来说，拦截下面这些操作。

Object.prototype.__proto__
Object.prototype.isPrototypeOf()
Object.getPrototypeOf()
Reflect.getPrototypeOf()
instanceof

10. isExtensible()
> 拦截Object.isExtensible操作。

11. ownKeys() 
> 用来拦截对象自身属性的读取操作。具体来说，拦截以下操作。

Object.getOwnPropertyNames()
Object.getOwnPropertySymbols()
Object.keys()
for...in循环

ownKeys方法返回的数组成员，只能是字符串或 Symbol 值。如果有其他类型的值，或者返回的根本不是数组，就会报错。

注意，使用Object.keys方法时，有三类属性会被ownKeys方法自动过滤，不会返回。

目标对象上不存在的属性
属性名为 Symbol 值
不可遍历（enumerable）的属性
```js
let target = {
  a: 1,
  b: 2,
  c: 3,
  [Symbol.for('secret')]: '4',
};

Object.defineProperty(target, 'key', {
  enumerable: false,
  configurable: true,
  writable: true,
  value: 'static'
});

let handler = {
  ownKeys(target) {
    return ['a', 'd', Symbol.for('secret'), 'key'];
  }
};

let proxy = new Proxy(target, handler);

Object.keys(proxy)
// ['a']
```

12. preventExtensions()
拦截Object.preventExtensions()。该方法必须返回一个布尔值，否则会被自动转为布尔值。

这个方法有一个限制，只有目标对象不可扩展时（即Object.isExtensible(proxy)为false），proxy.preventExtensions才能返回true，否则会报错。

13. setPrototypeOf()
主要用来拦截Object.setPrototypeOf方法。
该方法只能返回布尔值，否则会被自动转为布尔值。
另外，如果目标对象不可扩展（extensible），setPrototypeOf方法不得改变目标对象的原型。

### Proxy.revocable() 
> 返回一个可取消的 Proxy 实例。
```js
let target = {};
let handler = {};

let {proxy, revoke} = Proxy.revocable(target, handler);

proxy.foo = 123;
proxy.foo // 123

revoke();
proxy.foo // TypeError: Revoked
```
Proxy.revocable方法返回一个对象，该对象的proxy属性是Proxy实例，revoke属性是一个函数，可以取消Proxy实例。
上面代码中，当执行revoke函数之后，再访问Proxy实例，就会抛出一个错误。

Proxy.revocable的一个使用场景是，目标对象不允许直接访问，必须通过代理访问，一旦访问结束，就收回代理权，不允许再次访问。




async 函数是什么？一句话，它就是 Generator 函数的语法糖。

**Iterator 接口是一种数据遍历的协议**，只要调用遍历器对象的next方法，就会得到一个对象，表示当前遍历指针所在的那个位置的信息。

next方法返回的对象的结构是{value, done}，其中value表示当前的数据的值，done是一个布尔值，表示遍历是否结束。

这里隐含着一个规定，next方法必须是同步的，只要调用就必须立刻返回值。
也就是说，一旦执行next方法，就必须同步地得到value和done这两个属性。


ES2018 引入了”异步遍历器“（Async Iterator），为异步操作提供原生的遍历器接口，即value和done这两个属性都是异步产生。

异步遍历器的最大的语法特点，就是调用遍历器的next方法，返回的是一个 Promise 对象。
```js
asyncIterator
  .next()
  .then(
    ({ value, done }) => /* ... */
  );
```

我们知道，一个对象的同步遍历器的接口，部署在Symbol.iterator属性上面。
同样地，对象的异步遍历器接口，部署在Symbol.asyncIterator属性上面。
不管是什么样的对象，只要它的Symbol.asyncIterator属性有值，就表示应该对它进行异步遍历。
```js
const asyncGenObj = createAsyncIterable(['a', 'b']);
const [{value: v1}, {value: v2}] = await Promise.all([
  asyncGenObj.next(), asyncGenObj.next()
]);

console.log(v1, v2); // a b


```

异步遍历器的next方法是可以连续调用的，不必等到上一步产生的 Promise 对象resolve以后再调用。
这种情况下，next方法会累积起来，自动按照每一步的顺序运行下去。
```js
const asyncGenObj = createAsyncIterable(['a', 'b']);
const [{value: v1}, {value: v2}] = await Promise.all([
  asyncGenObj.next(), asyncGenObj.next()
]);

console.log(v1, v2); // a b
```


for...of循环用于遍历同步的 Iterator 接口。
新引入的for await...of循环，则是用于遍历异步的 Iterator 接口。

```js
let body = '';

async function f() {
  for await(const data of req) body += data;
  const parsed = JSON.parse(body);
  console.log('got', parsed);
}
```

异步 Generator 函数
Generator 函数处理同步操作和异步操作时，能够使用同一套接口。
```js
// 同步 Generator 函数
function* map(iterable, func) {
  const iter = iterable[Symbol.iterator]();
  while (true) {
    const {value, done} = iter.next();
    if (done) break;
    yield func(value);
  }
}

// 异步 Generator 函数
async function* map(iterable, func) {
  const iter = iterable[Symbol.asyncIterator]();
  while (true) {
    const {value, done} = await iter.next();
    if (done) break;
    yield func(value);
  }
}

async function* gen() {
  yield 'hello';
}
const genObj = gen();
genObj.next().then(x => console.log(x));
// { value: 'hello', done: false }

async function* readLines(path) {
  let file = await fileOpen(path);

  try {
    while (!file.EOF) {
      yield await file.readLine();
    }
  } finally {
    await file.close();
  }
}
```

Promise 回调函数的一种规范
Promise 中使用 resolve，别直接用 return 了
Promise 内部的错误不会影响到 Promise 外部的代码，通俗的说法就是“Promise 会吃掉错误”。
Promise.prototype.finally()
finally方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。该方法是 ES2018 引入标准的。
finally方法 不接受任何参数，这意味着没有办法知道，前面的 Promise 状态到底是fulfilled还是rejected。这表明，finally方法里面的操作，应该是与状态无关的，不依赖于 Promise 的执行结果。

await命令后面的Promise对象，运行结果可能是rejected，所以最好把await命令放在try...catch代码块中。
```js
async function myFunction() {
  await somethingThatReturnsAPromise()
  .catch(function (err) {
    console.log(err);
  });
}
```

JS的赋值还有一个很大的特性没有发现
假如 没有声明关键字 let const var 
只是 简单的 ， i = 5 会返回一个 5

**没有声明关键字 的定义语句，会返回 定义的值**

ES6 诞生以前，异步编程的方法，大概有下面四种。
- 回调函数
- 事件监听
- 发布/订阅
- Promise 对象

所谓"异步"，简单说就是一个任务不是连续完成的，
可以理解成该任务被人为分成两段，先执行第一段，然后转而执行其他任务，等做好了准备，再回过头执行第二段。

比如，有一个任务是读取文件进行处理，任务的第一段是向操作系统发出请求，要求读取文件。
然后，**程序执行其他任务，等到操作系统返回文件，再接着执行任务的第二段（处理文件）。**
这种不连续的执行，就叫做异步。

JavaScript 语言对异步编程的实现，就是回调函数。
所谓回调函数，就是把任务的第二段单独写在一个函数里面，等到重新执行这个任务的时候，就直接调用这个函数。
回调函数的英语名字callback，直译过来就是"重新调用"。


一个有趣的问题是，为什么 Node 约定，回调函数的第一个参数，必须是错误对象err（如果没有错误，该参数就是null）？

原因是执行分成两段，第一段执行完以后，任务所在的上下文环境就已经结束了。
在这以后抛出的错误，原来的上下文环境已经无法捕捉，只能当作参数，传入第二段。

### 协程 § ⇧

传统的编程语言，早有异步编程的解决方案（其实是多任务的解决方案）。
其中有一种叫做"协程"（coroutine），意思是多个线程互相协作，完成异步任务。

协程有点像函数，又有点像线程。它的运行流程大致如下。

第一步，协程A开始执行。
第二步，协程A执行到一半，进入暂停，执行权转移到协程B。
第三步，（一段时间后）协程B交还执行权。
第四步，协程A恢复执行。
上面流程的协程A，就是异步任务，因为它分成两段（或多段）执行。

举例来说，读取文件的协程写法如下。
```js
function* asyncJob() {
  // ...其他代码
  let f = yield readFile(fileA);
  // ...其他代码
}
```
上面代码的函数asyncJob是一个协程，它的奥妙就在其中的yield命令。
它表示执行到此处，执行权将交给其他协程。
也就是说，yield命令是异步两个阶段的分界线。

协程遇到yield命令就暂停，等到执行权返回，再从暂停的地方继续往后执行。
它的最大优点，就是代码的写法非常像同步操作，如果去除yield命令，简直一模一样。

Generator 函数是协程在 ES6 的实现，最大特点就是可以交出函数的执行权（即暂停执行）。

整个 Generator 函数就是一个封装的异步任务，或者说是异步任务的容器。异步操作需要暂停的地方，都用yield语句注明。

Generator 函数可以暂停执行和恢复执行，这是它能封装异步任务的根本原因
除此之外，它还有两个特性，使它可以作为异步编程的完整解决方案：函数体内外的数据交换和错误处理机制。




具有 iterator 接口的数据结构 
转换为数组 有两种方式，[...struct] Array.from(struct)

箭头函数
  自动绑定 定义时的 上下文对象
  不能用作 构造函数
  不能用作 Generator 函数
  不能使用 arguments


在 ES5 中的非严格模式下，更改参数值将会同步的更改 arguments 对象内的参数值，而在严格模式下不会更改。

对于 ES6 来说，无论是否在严格模式下，更改参数值的行为都不会同步更改 arguments 对象。


 ES6 改变了Object构造函数的行为，一旦发现Object方法不是通过new Object()这种形式调用，
 而是 class，ES6 规定Object构造函数会忽略参数。


子类必须在constructor方法中调用super方法，否则新建实例时会报错。
子类的构造函数中，只有调用super之后，才可以使用this关键字

Object.getPrototypeOf方法可以用来从子类上获取父类。

第一种情况，super作为函数调用时，代表父类的构造函数。ES6 要求，子类的构造函数必须执行一次super函数。

因此super()在这里相当于A.prototype.constructor.call(this)。

作为函数时，super()只能用在子类的构造函数之中，用在其他地方就会报错。

第二种情况，super作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。
使用super的时候，必须显式指定是作为函数、还是作为对象使用，否则会报错。

extends关键字后面可以跟多种类型的值。

```js
class C extends null {
  constructor() { return Object.create(null); }
}
```

extends关键字不仅可以用来继承类，还可以用来继承原生的构造函数。因此可以在原生数据结构的基础上，定义自己的数据结构。

```js
class VersionedArray extends Array {
  constructor() {
    super();
    this.history = [[]];
  }
  commit() {
    this.history.push(this.slice());
  }
  revert() {
    this.splice(0, this.length, ...this.history[this.history.length - 1]);
  }
}

let x = new VersionedArray();

x.push(1);
x.push(2);
x // [1, 2]
x.history // [[]]

x.commit();
x.history // [[], [1, 2]]

x.push(3);
x // [1, 2, 3]
x.history // [[], [1, 2]]

x.revert();
x // [1, 2]


class ExtendableError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.stack = (new Error()).stack;
    this.name = this.constructor.name;
  }
}

class MyError extends ExtendableError {
  constructor(m) {
    super(m);
  }
}

let myerror = new MyError('ll');
myerror.message // "ll"
myerror instanceof Error // true
myerror.name // "MyError"
myerror.stack
// Error
//     at MyError.ExtendableError
//     ...

```


Object.create(A.prototype);
// 等同于
B.prototype.__proto__ = A.prototype;

Object.setPrototypeOf(B.prototype, A.prototype);
// 等同于
B.prototype.__proto__ = A.prototype;

Object.setPrototypeOf(B, A);
// 等同于
B.__proto__ = A;



在子类普通方法中通过super调用父类的方法时，方法内部的this指向当前的子类实例。
```js
class A {
  constructor() {
    this.x = 1;
  }
  print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  m() {
    super.print();
  }
}

let b = new B();
b.m() // 2
```

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



类不存在变量提升

类的内部所有定义的方法，都是不可枚举的（non-enumerable）。
constructor方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法。
一个类必须有constructor方法，如果没有显式定义，一个空的constructor方法会被默认添加。

constructor方法默认返回实例对象（即this），完全可以指定返回另外一个对象。

如果静态方法包含 this 关键字，这个 this 指的是类，而不是实例
静态方法 可以和非静态方法重名
父类的静态方法，可以被子类继承
静态方法也是可以从 super 对象上调用的

静态属性只能 `类名.属性名 ` 声明

ES6 为new命令引入了一个new.target属性，该属性一般用在构造函数之中，返回new命令作用于的那个构造函数。
如果构造函数不是通过new命令调用的，new.target会返回undefined，因此这个属性可以用来确定构造函数是怎么调用的。
```js
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('本类不能实例化');
    }
  }
}

class Rectangle extends Shape {
  constructor(length, width) {
    super();
    // ...
  }
}

let x = new Shape();  // 报错
let y = new Rectangle(3, 4);  // 正确
```

**类必须使用new调用，否则会报错。这是它跟普通构造函数的一个主要区别，后者不用new也可以执行。**

类的方法内部如果含有this，它默认指向类的实例。但是，必须非常小心，一旦单独使用该方法，很可能报错。
防止 this 错误的解决方法
```js
<!-- 构造方法绑定 this -->
1. constructor() {
     this.printName = this.printName.bind(this);
   }

<!-- 使用箭头函数 -->
2. constructor() {
     this.printName = (name = 'there') => {
       this.print(`Hello ${name}`);
     };
   }

3. proxy
function selfish (target) {
  const cache = new WeakMap();
  const handler = {
    get (target, key) {
      const value = Reflect.get(target, key);
      if (typeof value !== 'function') {
        return value;
      }
      if (!cache.has(value)) {
        cache.set(value, value.bind(target));
      }
      return cache.get(value);
    }
  };
  const proxy = new Proxy(target, handler);
  return proxy;
}

const logger = selfish(new Logger());

```

构造函数的prototype属性，在 ES6 的“类”上面继续存在。事实上，类的所有方法都定义在类的prototype属性上面。

prototype 对象的 constructor 属性，直接指向”类“本身，这与 ES5 的行为是一致的
> Point.prototype.constructor === Point

类的内部所有定义的方法，都是不可枚举的

类和模块的内部，默认就是 严格模式


### Class 表达式 
与函数一样，类也可以使用 表达式的形式定义。
```js
const MyClass = class Me{
  getClassName(){
    return Me.name
  }
}
<!-- Me 只能在Class内部代码使用，指代当前类 -->

立即执行Class 表达式
let person = new class{
  constructor(name){
    this.name = name
  }
  sayName(){
    console.log(this.name)
  }
}('张三')
person.sayName()
```



浏览器记载 ES6 模块，也使用 script 标签，但是要加入 **type="module"** 属性
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



遍历器是一种接口，为各种不同的数据结构 提供统一的访问体制。
任何数据结构只要部署 Iterator 接口，就可以完成遍历

JavaScript 原有的for...in循环，只能获得对象的键名，不能直接获取键值。
ES6 提供for...of循环，允许遍历获得键值。
for...of循环调用遍历器接口，数组的遍历器接口只返回具有数字索引的属性。这一点跟for...in循环也不一样。

forEach 无法跳出循环，break return 命令都无法奏效，毕竟是两个函数嵌套

for...in循环有几个缺点。

- 数组的键名是数字，但是for...in循环是以字符串作为键名“0”、“1”、“2”等等。
- for...in循环不仅遍历数字键名，还会遍历手动添加的其他键，甚至包括原型链上的键。
- 某些情况下，for...in循环会以任意顺序遍历键名。
总之，for...in循环主要是为遍历对象而设计的，不适用于遍历数组。


for...of循环相比上面几种做法，有一些显著的优点。

有着同for...in一样的简洁语法，但是没有for...in那些缺点。
不同于forEach方法，它可以与break、continue和return配合使用。
提供了遍历所有数据结构的统一操作接口。


**只要某个数据结构部署了 Iterator 接口，就可以对它使用扩展运算符，将其转为数组。**
let arr = [...iterable];

for...of循环本质上就是调用这个接口产生的遍历器

Iterator 的作用有三个：
  一是为各种数据结构，提供一个统一的、简便的访问接口；
  二是使得数据结构的成员能够按某种次序排列；
  三是 ES6 创造了一种新的遍历命令for...of循环，Iterator 接口主要供for...of消费。

Iterator 的遍历过程是这样的。

（1）创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。

（2）第一次调用指针对象的next方法，可以将指针指向数据结构的第一个成员。

（3）第二次调用指针对象的next方法，指针就指向数据结构的第二个成员。

（4）不断调用指针对象的next方法，直到它指向数据结构的结束位置。

每一次调用next方法，都会返回数据结构的当前成员的信息。
具体来说，就是返回一个包含value和done两个属性的对象。
其中，value属性是当前成员的值，done属性是一个布尔值，表示遍历是否结束。

ES6 规定，**默认的 Iterator 接口部署在数据结构的Symbol.iterator属性，**
或者说，一个数据结构只要具有Symbol.iterator属性，就可以认为是“可遍历的”（iterable）。
Symbol.iterator属性本身是一个函数，就是当前数据结构默认的遍历器生成函数。
执行这个函数，就会返回一个遍历器。{next}
至于属性名Symbol.iterator，它是一个表达式，返回Symbol对象的iterator属性，
这是一个预定义好的、类型为 Symbol 的特殊值，所以要放在方括号内

原生具备 Iterator 接口的数据结构如下。

Array
Map
Set
String
TypedArray
函数的 arguments 对象
NodeList 对象

```js
let arr = ['a', 'b', 'c'];
let iter = arr[Symbol.iterator]();

iter.next() // { value: 'a', done: false }
iter.next() // { value: 'b', done: false }
iter.next() // { value: 'c', done: false }
iter.next() // { value: undefined, done: true }
```

上面代码中，变量arr是一个数组，原生就具有遍历器接口，部署在arr的Symbol.iterator属性上面。
所以，调用这个属性，就得到遍历器对象。

对于原生部署 Iterator 接口的数据结构，不用自己写遍历器生成函数，for...of循环会自动遍历它们。
除此之外，其他数据结构（主要是对象）的 Iterator 接口，都需要自己在Symbol.iterator属性上面部署，这样才会被for...of循环遍历。
```js
class RangeIterator {
  constructor(start, stop) {
    this.value = start;
    this.stop = stop;
  }

  [Symbol.iterator]() { return this; }

  next() {
    let value = this.value;
    if (value < this.stop) {
      this.value++;
      return {done: false, value: value};
    }
    return {done: true, value: undefined};
  }
}

function range(start, stop) {
  return new RangeIterator(start, stop);
}

for (let value of range(0, 3)) {
  console.log(value); // 0, 1, 2
}
```

模仿指针
```js
function Obj(value) {
  this.value = value;
  this.next = null;
}

Obj.prototype[Symbol.iterator] = function() {
  let iterator = { next: next };

  let current = this;

  function next() {
    if (current) {
      let value = current.value;
      current = current.next;
      return { done: false, value: value };
    } else {
      return { done: true };
    }
  }
  return iterator;
}

let one = new Obj(1);
let two = new Obj(2);
let three = new Obj(3);

one.next = two;
two.next = three;

for (let i of one){
  console.log(i); // 1, 2, 3
}
```

遍历器对象本质上，就是一个指针对象。

对于类似数组的对象（存在数值键名和length属性），部署 Iterator 接口，有一个简便方法，就是Symbol.iterator方法直接引用数组的 Iterator 接口。
```js
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
// 或者
NodeList.prototype[Symbol.iterator] = [][Symbol.iterator];

[...document.querySelectorAll('div')] // 可以执行了
NodeList 对象是类似数组的对象，本来就具有遍历接口，可以直接遍历。

**类似数组对象的遍历**
const iterable = {
  0:'a',
  1:'b',
  2:'c',
  length:3,
  [Symbol.iterator]:[][Symbol.iterator]
}
for(let i of iterable){
  console.log(i)
}
```

对数组和 Set 结构进行解构赋值时，会默认调用Symbol.iterator方法。
扩展运算符（...）也会调用默认的 Iterator 接口。


### Set
类似于数组，但是成员的值都是唯一的，没有重复的值。

- 初始化
> new Set(具有 iterable接口的数据结构)

Set 内部判断两个值是否不同，使用的算法叫做“Same-value-zero equality”，它类似于精确相等运算符（===）
需要注意，两个对象总是不相等，就算是
### 属性
1. set.size
返回 set 中成员的个数

### API
1. set.add(value)
> 添加某个值，返回 set 结构本身，可链式调用

2. set.detele(value)
> 删除某个值，返回一个布尔值，表示是否删除成功

3. set.has(value)
> 返回一个布尔值，表示该值是否为 set的成员

4. set.clear()
> 清除所有成员，没有返回值

5. set.keys()
> 返回键名的遍历器

6. set.values()
> 返回键值的遍历器

7. set.entries()
> 返回键值对的遍历器

8. set.forEach()
> 使用回调函数遍历每个成员
mySet.forEach((value,key)=>console.log(value,key))


```js
1. Array.from方法可以将 Set 结构转为数组。
Array.from(mySet,(value,index)=>value)
> [1, 2, 3, 4]

2. 使用扩展运算符 也不失为一种方法
let arr = [...set];
// ['red', 'green', 'blue']
```

利用 set 实现并集，交集，差集
```js
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]);
// Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter(x => b.has(x)));
// set {2, 3}

// 差集
let difference = new Set([...a].filter(x => !b.has(x)));
// Set {1}
```

解构赋值,默认调用Symbol.iterator方法。
```js
let set = new Set().add('a').add('b').add('c');

let [x,y] = set;
// x='a'; y='b'

let [first, ...rest] = set;
// first='a'; rest=['b','c'];
```

### WeakSet
1. 成员只能是 对象
2. 成员都是 弱引用
3. 不可遍历
4. 没有 clear API
即垃圾回收机制不考虑 WeakSet 对该对象的引用，
也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。

因此，WeakSet 适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在 WeakSet 里面的引用就会自动消失。

由于上面这个特点，WeakSet 的成员是不适合引用的，因为它会随时消失。
另外，由于 WeakSet 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的，
因此 ES6 规定 WeakSet 不可遍历。

### Map
JavaScript 的对象（Object），本质上是键值对的集合（Hash 结构），但是传统上只能用字符串当作键。这给它的使用带来了很大的限制。
```js
const data = {};
const element = document.getElementById('myDiv');
// element.toString === "[object HTMLDivElement]"

data[element] = 'metadata';
data['[object HTMLDivElement]'] // "metadata"
```

为了解决这个问题，ES6 提供了 Map 数据结构。
它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。
**也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。**
如果你需要“键值对”的数据结构，Map 比 Object 更合适。

- 初始化
> new Map([[Symbol.for('name'),'Simon']]).get(Symbol.for('name'))
> new Map([ [键名,键值],[键名,键值],[键名,键值]... ])
1. 每一个 键值对组成的数组 只能两个成员，之后的成员会被自动忽略
2. 注意，只有对同一个对象的引用，Map 结构才将其视为同一个键。

map 执行构造函数时，实际上执行的是以下算法
```js
const items = [
  ['name', '张三'],
  ['title', 'Author']
];

const map = new Map();

items.forEach(
  ([key, value]) => map.set(key, value)
  [key,value] 解构的正是 循环中的元素，取出前两个元素
);

```

### 属性
1. size
返回 Map 结构的成员总数。

### API
1. map.set(key,value)
> set方法设置键名key对应的键值为value，然后返回整个 Map 结构。因此可以采用链式写法。
> 如果key已经有值，则键值会被更新，否则就新生成该键。

2. map.get(key)
> get方法读取key对应的键值，如果找不到key，返回undefined。

3. map.has(key)
> has方法返回一个布尔值，表示某个键是否在当前 Map 对象之中。

4. map.delete(key)
> delete方法删除某个键，返回true。如果删除失败，返回false。

5. map.clear()
> clear方法清除所有成员，没有返回值。

**map的遍历顺序就是插入顺序**
**Map 结构的默认遍历器接口（Symbol.iterator属性），就是entries方法。**

6. map.keys()
> 返回键名的遍历器。

7. map.values()
> 返回键值的遍历器。

8. map.entries()
> 返回所有成员的遍历器

9. forEach()
> 遍历 map成员

### 转换
map 转数组，和 set 类似
```js
myMap.set(true,1).set({foo:3},['abc'])
[...myMap]
Array.from(myMap)
```

map转对象
```js
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

const myMap = new Map()
  .set('yes', true)
  .set('no', false);
strMapToObj(myMap)
```

### WeakMap
弱引用~
1. WeakMap只接受对象作为键名（null除外），不接受其他类型的值作为键名。
2. 没有遍历操作（即没有keys()、values()和entries()方法），也没有size属性



**纯对象**
let obj = Object.create(null);


.$("iframe[name='iframeWindow']")[0].contentWindow
iframe.contentWindow 返回 加载框架的 window 对象

### Symbol
> 新的原始类型，表示 独一无二的值。
```js
let s = Symbol()
```

1. Symbol函数前不能使用new命令，否则会报错。
  这是因为生成的 Symbol 是一个原始类型的值，不是对象。 基本上，它是一种类似于字符串的数据类型。

2. Symbol函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。

3. Symbol 值不能与其他类型的值进行运算，会报错。

4. Symbol 值作为对象属性名时，不能用点运算符。
不论是 定义对象时 `const obj{[mySymbol]:'asd'}`
还是访问属性时 `obj[myMethod]()`
```js
const log.levels = {
  DEBUG : Symbol('debug'),
  INFO : Symbol('info'),
  WARN: Symbol('WARN')
}
```

### API

1. Object.getOwnPropertySymbols(obj)
> 方法返回一个数组，成员是当前对象的所有用作属性名的 Symbol 值。

2. Symbol.for(name)
有时，我们希望重新使用同一个 Symbol 值，Symbol.for方法可以做到这一点。
它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值。
如果有，就返回这个 Symbol 值，否则就新建并返回一个以该字符串为名称的 Symbol 值。
```js
let s1 = Symbol.for('foo');
let s2 = Symbol.for('foo');

s1 === s2 // true
```
Symbol.for()与Symbol()这两种写法，都会生成新的 Symbol。
它们的区别是，前者会被登记在全局环境中供搜索，后者不会。
Symbol.for()不会每次调用就返回一个新的 Symbol 类型的值，而是会先检查给定的key是否已经存在，如果不存在才会新建一个值。
比如，如果你调用Symbol.for("cat")30 次，每次都会返回同一个 Symbol 值，但是调用Symbol("cat")30 次，会返回 30 个不同的 Symbol 值。

3. Symbol.keyFor
方法返回一个已登记的 Symbol 类型值的key。

```js
let s1 = Symbol.for("foo");
Symbol.keyFor(s1) // "foo"
```

4. Symbol.hasInstance
> 对象的Symbol.hasInstance属性，指向一个内部方法。
> 当其他对象使用instanceof运算符，判断是否为该对象的实例时，会调用这个方法。
```js
const Even = {
  [Symbol.hasInstance](obj) {
    return Number(obj) % 2 === 0;
  }
};

1 instanceof Even // false
2 instanceof Even // true
```

5. Symbol.isConcatSpreadable 
> 表示该对象用于Array.prototype.concat()时，是否可以展开。

6. 还有很多。。



骚操作。。
class T1 extends Promise { }
new T1().then()xxx



+new Date()相当于 ToNumber(new Date())

尤达表达式是什么？
  尤达表达式是计算机编程中的一种风格，其中表达式的两个部分与条件语句中的典型顺序相反。
  这种风格的命名，来源于星球大战的一个角色，绝地大师尤达（Yoda）。
    剧中，该角色喜欢以颠倒的语序说英语。比如“当九百岁你活到，看起来很好你将不”。
  下面举个栗子：

  // 正常的写法
  if(number == 7){/* code */}

  // 尤达表达式
  if(7 == number){/* code */}
    特点就是：将表达式的常量部分放在条件语句的左侧。

  缺点：代码可读性 - 1
  优点：避免写出赋值语句

### 函数节流
> 函数在指定间隔时间内 最多只执行一次
> 我们不是要在每完成等待某个时间后去执行某函数，而是要每间隔某个时间去执行某函数，避免函数的过多执行
> 如果你持续触发事件，每隔一段时间，只执行一次事件。

关于节流的实现，有两种主流的实现方式，一种是使用时间戳，一种是设置定时器。
```js
function throttle(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    if (!timeout) {
      timeout = setTimeout(function(){
        timeout = null;
        func.apply(context, args)
      }, wait)
    }
  }
}
```

### 函数防抖
> 函数在上一次执行后，满足等待某个时间内不再触发此函数后再执行，而在这个等待时间内再次触发此函数，等待时间会重新计算。
你尽管触发事件，但是我一定在事件触发 n 秒后才执行，
如果你在一个事件触发的 n 秒内又触发了这个事件，那我就以新的事件的时间为准，n 秒后才执行，
总之，就是要等你触发完事件 n 秒内不再触发事件，我才执行，真是任性呐!
```js
// 第一版
function debounce(func,wait){
  let timeout
  return function(){
    const context = this
    const arg = arguments
    clearTimeout(timeout)
    timeout = setTimeout(()=>func.apply(context,arg),wait)
  }
}
```

setTimeout和setInterval返回的整数值是连续的，也就是说，第二个setTimeout方法返回的整数值，将比第一个的整数值大1。
```js
function f() {}
setTimeout(f, 1000) // 10
setTimeout(f, 1000) // 11
setTimeout(f, 1000) // 12
```

第二行为person对象扩展了age属性，当然你可以阻止这一行为，使用Object.preventExtensions()
```js
let person = { name: 'addone' };
Object.preventExtensions(person);
person.age = 20;
person.age // undefined
```
你还可以用Object.isExtensible()来判断对象是不是可扩展的
请记住这是不可扩展!!，即不能添加属性或方法

**密封对象不可扩展，且不能删除属性和方法**
```js
let person = { name: 'addone' };
Object.isExtensible(person); // true
Object.isSealed(person); // false

Object.seal(person);
Object.isExtensible(person); // false
Object.isSealed(person); // true
```


冻结的对象
这是最严格的防篡改级别，**冻结的对象即不可扩展，又密封，且不能修改**

同样也有Object.isFrozen来检测
```js
let person = { name: 'addone' };
Object.freeze(person);
Object.isExtensible(person); // true
```

以上三种方法在严格模式下进行错误操作均会导致抛出错误

匿名函数的 name 属性为 "anonymous"

### 对象
Object.is()
> 用来比较两个值是否严格相等，与严格比较运算符（===）的行为基本一致。

Object.assign(目标对象,源对象1,源对象2...)
> 用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）。

如果该参数不是对象，则会先转成对象，然后返回。
由于undefined和null无法转成对象，所以如果它们作为目标对象，就会报错。

Object.assign拷贝的属性是有限制的，
1. 只拷贝源对象的自身属性（不拷贝继承属性），
2. 也不拷贝不可枚举的属性（enumerable: false）。

1. Object.assign方法实行的是浅拷贝，而不是深拷贝。
也就是说，如果源对象某个属性的值是对象，那么目标对象拷贝得到的是这个对象的引用。

2. 注意，如果目标对象与源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性。

3. Object.assign只能进行值的复制，如果要复制的值是一个取值函数，那么将求值后再复制。

4. Object.assign([1, 2, 3], [4, 5])
> // [4, 5, 3]
Object.assign可以用来处理数组，但是会把数组视为对象,
上面代码中，Object.assign把数组视为属性名为 0、1、2 的对象，因此源数组的 0 号属性4覆盖了目标数组的 0 号属性1。


应用
```js
[1] 为对象添加属性
class Point {
  constructor(x, y) {
    Object.assign(this, {x, y});
  }
}

[2] 为对象添加方法
Object.assign(SomeClass.prototype, {
  someMethod(arg1, arg2) {
    ···
  },
  anotherMethod() {
    ···
  }
});

[3] 克隆对象
function clone(origin) {
  let originProto = Object.getPrototypeOf(origin);
  return Object.assign(Object.create(originProto), origin);
}

[4] 合并多个对象
const merge = (target, ...sources) => Object.assign(target, ...sources);

[5] 为属性指定默认值
const DEFAULTS = {
  logLevel: 0,
  outputFormat: 'html'
};

function processContent(options) {
  options = Object.assign({}, DEFAULTS, options);
  console.log(options);
  // ...
}

上面代码中，DEFAULTS对象是默认值，options对象是用户提供的参数。
Object.assign方法将DEFAULTS和options合并成一个新对象，如果两者有同名属性，则option的属性值会覆盖DEFAULTS的属性值。

注意，由于存在浅拷贝的问题，DEFAULTS对象和options对象的所有属性的值，最好都是简单类型，不要指向另一个对象。
否则，DEFAULTS对象的该属性很可能不起作用。
```

1. Object.getOwnPropertyDescriptor(obj,prop)
可以获取该属性的描述对象。

2. Object.getOwnPropertyDescriptors(obj)
返回一个对象，所有原对象的属性名都是该对象的属性名，对应的属性值就是该属性的描述对象。

3. Object.setPrototypeOf(object, prototype)
> ES6 正式推荐的设置原型对象的方法。

4. Object.getPrototypeOf(obj);
> 用于读取一个对象的原型对象。

5. Object.keys(obj)
> 返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键名。

6. Object.values(obj)
> 方法返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值。

Object.values('foo')
// ['f', 'o', 'o']

上面代码中，字符串会先转成一个类似数组的对象。字符串的每个字符，就是该对象的一个属性。
因此，Object.values返回每个属性的键值，就是各个字符组成的一个数组。

7. Object.entries(obj)
> 方法返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值对数组。

**Object.keys()/Object.values()/Object.entries() 都会忽略 Symbol**

const obj = { foo: 'bar', baz: 42 };
Object.entries(obj)
// [ ["foo", "bar"], ["baz", 42] ]

Object.entries方法的另一个用处是，将对象转为真正的Map结构。
```js
const obj = { foo: 'bar', baz: 42 };
const map = new Map(Object.entries(obj));
map // Map { foo: "bar", baz: 42 }
```

Object.defineProperty(a, mySymbol, { value: 'Hello!' });

**Reflect.ownKeys(obj)**
> 返回一个数组，包含对象自身的所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。

对象的扩展运算符（...）用于取出参数对象的所有可遍历属性，拷贝到当前对象之中。
解构赋值的拷贝是浅拷贝，即如果一个键的值是复合类型的值（数组、对象、函数）、那么解构赋值拷贝的是这个值的引用，而不是这个值的副本。

```js
let z = { a: 3, b: 4 };
let n = { ...z };
n // { a: 3, b: 4 }
这等同于使用Object.assign方法。

let aClone = { ...a };
// 等同于
let aClone = Object.assign({}, a);

let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
x // 1
y // 2
z // { a: 3, b: 4 }
```

### super
this关键字总是指向函数所在的当前对象，ES6 又新增了另一个类似的关键字super，指向当前对象的原型对象。
super关键字表示原型对象时，只能用在对象的方法之中，用在其他地方都会报错。
super.foo等同于Object.getPrototypeOf(this).foo（属性）
            或Object.getPrototypeOf(this).foo.call(this)（方法）。
```js
const proto = {
  foo: 'hello'
};

const obj = {
  foo: 'world',
  find() {
    return super.foo;
  }
};

Object.setPrototypeOf(obj, proto);
obj.find() // "hello"
```

### 属性的存取器
1. 属性以下划线开头
2. get set 外部访问属性去掉下划线

```js
const obj={
  _wheel:4,
  set wheel(value){
    if(value<0){
      throw new Error('不能赋值负数！')
    }
    this._wheel = wheel
  },
  get wheel(){
    return this._wheel
  }
}
访问属性 **obj.wheel**
```


**背下来**
箭头函数有几个使用注意点。
 **踩了多少次坑了**
（1）函数体内的this，绑定定义时所在的作用域，而不是指向运行时所在的作用域。

（2）不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。
 **很重要**
（3）不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。

（4）不可以使用yield命令，**因此箭头函数不能用作 Generator 函数。**

ES2017 允许函数的最后一个参数有尾逗号（trailing comma）。

**敲黑板**
ES2016 做了一点修改，规定只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。

ES6 写入标准，函数的name属性，返回该函数的函数名。

### 默认参数
1. 默认参数是可以和外部变量结合起来一起使用的~
```js
let x = 99;
function foo(p = x + 1) {
  console.log(p);
}

foo() // 100
```
为什么 我看着很陌生~
2. length 属性
**指定了默认值以后，函数的length属性，将返回没有指定默认值的参数个数。**
**如果设置了默认值的参数不是尾参数，那么length属性也不再计入后面的参数了。**
也就是说，指定了默认值后，length属性将失真。
`(function (a, b = 1, c) {}).length // 1`
> 原来还有这种操作~

3. 作用域
一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域（context）。
等到初始化结束，这个作用域就会消失。这种语法行为，在不设置参数默认值时，是不会出现的。
```js
function func(x,y=x+1){console.log(y)}
func(5)
>> 6
```

数值 ES6
1. Number.isFinite()
> 用来检查一个数值是否为有限的（finite）
2. Number.isNaN()
> 用来检查一个值是否为NaN。

ES6 将全局方法parseInt()和parseFloat()，移植到Number对象上面，行为完全保持不变。

3. Number.isInteger()
> 用来判断一个数值是否为整数。
还有此等函数~

4. Math.trunc()
> Math.trunc方法用于去除一个数的小数部分，返回整数部分.
向下取整~

5. Math.sign方法用来判断一个数到底是正数、负数、还是零。对于非数值，会先将其转换为数值。

它会返回五种值。

参数为正数，返回+1；
参数为负数，返回-1；
参数为 0，返回0；
参数为-0，返回-0;
其他值，返回NaN。

6. ** 指数运算
这个 人性化多了

由于数组本质是特殊的对象，因此可以对数组进行对象属性的解构。
**敲黑板**
```js
let arr = [1, 2, 3];
let {0 : first, [arr.length - 1] : last} = arr;
```
针对 数组 用对象解构真的是 对js语言掌握到了一定程度~

**字符串是类数组**
```js
let {length : len} = 'hello';
const [a, b, c, d, e] = 'hello';
a // "h"
```

函数参数的默认解构~
```js
function move({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}
```

`let [head, ...tail] = [1, 2, 3, 4]`
事实上，只要某种数据结构具有 Iterator 接口，都可以采用数组形式的解构赋值。

const {解构键名:别名 = 默认值} = 解构对象

字符串 ES6
1. ES6 为字符串提供了遍历接口
  ```js
  for (let codePoint of 'foo') {
    console.log(codePoint)
  }
  // "f"
  // "o"
  // "o"  
  ```
2. includes(搜索字符，开始搜索的位置)
  > 返回布尔值，表示是否找到了参数字符串。
3. startsWith(搜索字符，开始搜索的位置)
  > 返回布尔值，表示参数字符串是否在原字符串的头部。
4. endsWith(搜索字符，开始搜索的位置)
  > 返回布尔值，表示参数字符串是否在原字符串的尾部

这三个方法都支持第二个参数，表示开始搜索的位置。
```js
let s = 'Hello world!';

s.startsWith('world', 6) // true
s.endsWith('Hello', 5) // true
s.includes('Hello', 6) // false
```
上面代码表示，使用第二个参数n时，endsWith的行为与其他两个方法有所不同。
它针对前n个字符，而其他两个方法针对从第n个位置直到字符串结束。

4. repeat()
> repeat方法返回一个新字符串，表示将原字符串重复n次。
有趣的是 我刚知道 在 Python Ruby的语言中，可以这样重复一个字符串
`"foo"*3`

5. padStart(最小长度,补全字符串=空格),padEnd()
> 如果某个字符串不够指定长度，会在头部或尾部补全。padStart()用于头部补全，padEnd()用于尾部补全。
padStart和padEnd一共接受两个参数，
  - 第一个参数用来指定字符串的最小长度，
  - 第二个参数是用来补全的字符串。

1. 如果原字符串的长度，等于或大于指定的最小长度，则返回原字符串。
2. 如果用来补全的字符串与原字符串，两者的长度之和超过了指定的最小长度，则会截去超出位数的补全字符串。
3. 如果省略第二个参数，默认使用空格补全长度。

padStart的常见用途是为数值补全指定位数。
```js
'1'.padStart(10, '0') // "0000000001"
'12'.padStart(10, '0') // "0000000012"
'123456'.padStart(10, '0') // "0000123456"
```

将 数组分解为 函数的各个参数
假设 存在函数 func(x,y,z) , 数组 args[0,1,2]
```js
1. ES5
func.apply(null,args)

2. ES6
func(...args)
```

数组长度为 x
扩展运算符 + 数组 / 伪数组
> 将数组分解成 x个 单个元素

扩展运算符 + x个 单个元素
> 将单个元素合并成一个数组 并且长度为 x


Array
  1. Array.of 
  > 将参数转换成一个数组
  > Array(..)的构造器有一个尽人皆知的坑：
  > 如果仅有一个参数值被传递，而且这个参数值是一个数字的话，它并不会制造一个含有一个带有该数值元素的数组，
  > 而是构建一个长度等于这个数字的空数组。
  > ```js
  > let a = Array( 3 );
  > a.length;						// 3
  > a[0];							// undefined
  > ```

  let b = Array.of( 3 );
  b.length;						// 1
  b[0];							// 3

  ```
  2. Array.from(类数组,map)
  > 将类数组转换成真正的数组
  ```js
  let arrLike = {
	length: 4,
	2: "foo"
  };

  Array.from( arrLike );
  // [ undefined, undefined, "foo", undefined ]
  ```
  Array.from(..)工具还有另外一个绝技。
  **第二个参数值**，如果被提供的话，是一个映射函数（和普通的Array#map(..)几乎相同），它在将每个源值映射/变形为返回的目标值时调用。
  ```js
  let arrLike = {
    length: 4,
    2: "foo"
  };

  Array.from( arrLike, function mapper(val,idx){
    if (typeof val == "string") {
      return val.toUpperCase();
    }
    else {
      return idx;
    }
  } );
  // [ 0, 1, "FOO", 3 ]
  ```
  3. copyWithin(要被覆盖的索引位置,拷贝开始的索引位置(含),可选的拷贝结束的索引位置(不含))
  > 将数组的一部分拷贝到同一个数组的其他位置，覆盖之前存在在那里的任何东西。
  如果这些参数值中存在任何负数，那么它们就被认为是相对于数组的末尾。

  4. fill(填充元素,起始索引,结束索引(不含))
  ```js
  [1,2,3,4].fill('a',1,3)
  > [1, "a", "a", 4]
  ```
  5. find(func)/findIndex(func)
  > find,findIndex 接受一个函数作为参数，返回一个查询条件，布尔值
  > ```js
  > let points = [
  >   { x: 10, y: 20 },
  >   { x: 20, y: 30 },
  >   { x: 30, y: 40 },
  >   { x: 40, y: 50 },
  >   { x: 50, y: 60 }
  > ];
  > ```

  points.find( function matcher(point) {
    return (
      point.x % 3 == 0 &&
      point.y % 4 == 0
    );
  } )
  ```
  6. includes

有关 new 对象的那点事
  如果构造函数内部有return语句，而且return后面跟着一个对象，new命令会返回return语句指定的对象；
  否则，就会不管return语句，返回this对象。
  ```js
function _new(/* 构造函数 */ constructor, /* 构造函数参数 */ params) {
  // 将 arguments 对象转为数组
  let args = [].slice.call(arguments);
  // 取出构造函数
  let constructor = args.shift();
  // 创建一个空对象，继承构造函数的 prototype 属性
  let context = Object.create(constructor.prototype);
  // 执行构造函数
  let result = constructor.apply(context, args);
  // 如果返回结果是对象，就直接返回，否则返回 context 对象
  return (typeof result === 'object' && result != null) ? result : context;
}

// 实例
let actor = _new(Person, '张三', 28);
  ```
  函数内部可以使用new.target属性。如果当前函数是new命令调用，new.target指向当前函数，否则为undefined。

+"123" 转换变量（数字字符串）为数字
!!obj 转换变量为布尔值
~obj 向下取整

for...in语句以任意顺序遍历一个对象的可枚举属性。对于每个不同的属性,语句都会被执行。
hasOwnProperty 是 JavaScript 中唯一一个处理属性但是不查找原型链的函数。



一个常见的误解 是数字的字面值 不能被当作对象使用。
这是因为 JS 解析器的一个错误，它试图 将 点操作符解析为 浮点数字面值的一部分
`2.toString()` // 错误 SyntaxError

有很多变通方法可以让数字的字面值看起来像对象
```js
2..toString() //第二个点号可以正常解析
2 .toString() // 注意点号前面的空格
(2).toString() // 2 先被计算
```

**删除属性的唯一方法是使用 delete 操作符；**
设置属性为 undefined 或者 null 并不能真正的删除属性， 而仅仅是移除了属性和值的关联。

FormData
1. append(key,value)
2. set(key,newValue)
3. delete(key)
4. get/getAll(key)
5. has(key)
6. keys
7. values
8. entries

```js
// 获取页面已有的一个form表单
let form = document.getElementById("myForm");
// 用表单来初始化
let formData = new FormData(form);
// 我们可以根据name来访问表单中的字段
let name = formData.get("name"); // 获取名字
// 当然也可以在此基础上，添加其他数据
formData.append("token","kshdfiwi3rh");
```

let encodedData = window.btoa("Hello, world"); // 编码
let decodedData = window.atob(encodedData); // 解码

**click()** 方法可模拟在按钮上的一次鼠标单击。
buttonObject.click()

打开页面即 自动下载东西
```js
let a = document.createElement("a");
a.href =window.URL.createObjectURL(myFile); //下载路径指向这个文件对象 
a.download = "SunnyChuan.xlsx"; 
a.click();    //指定页面自动下载文件
document.body.appendChild(a);
```

对象解构处理数组
```js
const csvFileLine = '1997,John Doe,US,john@doe.com,New York';
const { 2: country, 4: state } = csvFi
```

数组的 Array.prototype.call 等价于 [].call
`let args = [].slice.call(arguments, 1)`

```js
let addEvent = (function(){
    if (window.addEventListener) {
        return function (type, el, fn) {
            el.addEventListener(type, fn, false);
        }
    }
    else if(window.attachEvent){
        return function (type, el, fn) {
            el.attachEvent('on' + type, fn);
        }
    }
})();
```

数组的浅拷贝：`concat` `slice`
如果数组元素是一个对象 则不适用

ES6 数组的复制 
```js
const a1 = [1,2,3]
const a2 = [...a1]
or
const [...a2] = a1
```

深拷贝，简单粗暴 可以使用 **JSON.parse(JSON.stringify(arr))**
但是不能拷贝函数
JSON.stringify(..) 在对象中遇到 undefined 、 function 和 symbol 时会自动将其忽略， 在 数组中则会返回 null （以保证单元位置不变）。

函数的作用域基于函数创建的位置

[...'...']
(3) [".", ".", "."]

[1, 2, 3] + [4, 5, 6]  // -> '1,2,34,5,6'

*slice 取出倒数元素*
let array = [1, 2, 3, 4, 5, 6];  
console.log(array.slice(-1)); // [6]  
console.log(array.slice(-2)); // [5,6]  

**数组解构，一次没用过~**
```js
const arr = [1, 2, 3, 4];

const [first, second] = arr;
```

**不要在非函数代码块（if、while 等）中声明一个函数**
永远不要在一个非函数代码块（if、while 等）中声明一个函数，把那个函数赋给一个变量。
浏览器允许你这么做，但它们的解析表现不一致。
注意: ECMA-262 把 block 定义为一组语句。函数声明不是语句。

```js
// bad
if (currentUser) {
  function test() {
    console.log('Nope.');
  }
}

// good
let test;
if (currentUser) {
  test = () => {
    console.log('Yup.');
  };
}
```

不要使用 arguments。可以选择 rest 语法 ... 替代。成为一个真正的数组
```js
// good
function concatenateAll(...args) {
  return args.join('');
}
```

this 调用妙招
```js
// good
class Jedi {
  jump() {
    this.jumping = true;
    return this;
  }

  setHeight(height) {
    this.height = height;
    return this;
  }
}

const luke = new Jedi();

luke.jump()
  .setHeight(20);
```

- 使用 const 声明每一个变量。
- 将所有的 const 和 let 分组

- 使用 /** ... */ 作为多行注释。包含描述、指定所有参数和返回值的类型和值。
- 对数字使用 parseInt 转换，并带上类型转换的基数.


WebSocket协议：
服务器可以主动向客户端推送信息，客户端也可以主动向服务器发送信息，
是真正的双向平等对话，属于服务器推送技术的一种。

其他特点包括：

（1）建立在 TCP 协议之上，服务器端的实现比较容易。

（2）与 HTTP 协议有着良好的兼容性。默认端口也是80和443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。

（3）数据格式比较轻量，性能开销小，通信高效。

（4）可以发送文本，也可以发送二进制数据。

（5）没有同源限制，客户端可以与任意服务器通信。

（6）协议标识符是ws（如果加密，则为wss），服务器网址就是 URL。


var声明可以在包含它的函数，模块，命名空间或全局作用域内部任何位置被访问
以及 function 也是这样 变量提升

function f(shouldInitialize: boolean) {
  if (shouldInitialize) {
    var x = 10;
  }

  return x;
}

f(true);  // returns '10'
f(false); // returns 'undefined'

变量 x是定义在*if语句里面*，但是我们却可以在语句的外面访问它。 这是因为 var声明可以在包含它的函数，模块，命名空间或全局作用域内部任何位置被访问



Window.open(链接，窗口的名字，窗口的属性)
window.open("https://www.wrox.com/","wroxWindow","height=100,width=100,top=2--,resizable=false")
具体参见 高程 200页

可利用 navigator.plugins[i].name 检查浏览器时候安装某些插件



~~Number -> Math.floor(Number)

call 比 apply 快很多
apply 在运行前要对作为参数的数组进行一系列检验和深拷贝，.call 则没有这些步骤

使用addEventListener()注册的事件处理程序按照他们的注册顺序调用。
使用attachEvent()注册的处理程序可能按照任何顺序调用，所以代码不应该依赖于调用顺序。

擅用 Git 搜索引擎

obj.method() this默认obj
obj.method.call(xx)传入this参数
this是函数中的第一个参数，如果不使用 call apply 等指明，浏览器自动推算

"use strict"
this不会指向window
绑定事件中的this就是触发事件的元素，jquery也是这样


call()
call(undefined)无区别 ，undefined 可以起到站位的作用


obj={method:function(){} }
obj.method保存的是函数的地址，与函数一点关系都没有！


箭头函数有几个使用注意点。

（1）函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。

（2）不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。

（3）不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。

（4）不可以使用yield命令，因此箭头函数不能用作 Generator 函数。

this对象的指向是可变的，但是在箭头函数中，它是固定的。

总结：箭头函数 this为定义时所在的对象，禁止 new，arguments，yield


闭包
	函数包含函数
	内部函数 可以使用 外部数据
	return 内部函数

JavaScript 能够表示的数值范围为21024到2-1023（开区间）

控制台中的 self 属性可返回对窗口自身的只读引用。等价于 Window 属性。

Object.keys() 方法会返回一个由一个给定对象的自身可枚举属性组成的数组，
数组中属性名的排列顺序和使用 for...in 循环遍历该对象时返回的顺序一致 

	const obj = { 0:"a", 1:"b", 2:{3:"c", 4:"d"}};
	
	Object.keys(obj)
	>> ["0", "1", "2"]

+变量 === Number(变量)
	Boolean:true返回1，false返回0
	null，返回0
	undefined，返回NaN

void 0 === undefined

obj.__proto__ === obj1.__proto__ 
>> true

当我们需要访问引用类型（如对象，数组，函数等）的值时，首先从栈中获得该对象的地址指针，然后再从堆内存中取得所需的数据。

如果一个函数返回一个对象 那么这个函数就是构造函数

let 声明的变量的作用域是块级的；
let 不能重复声明已存在的变量；
let 有暂时死区，不会被提升。


npm script 串行 &&
npm script 并行 &


实例化的Promise对象会立即执行

- 利用(function(){})()不会污染外面的变量
```js
obj.dispatchEvent(new CustomEvent(name));

const Blog={
	toc:(function(){
		const header = ...
		return {
			active:function(){}
		}
	})()

}

Blog.toc.active
const obj = (function(){
	const header = ...
	return {
		active:function(){}
	}
})();
obj.active();
```