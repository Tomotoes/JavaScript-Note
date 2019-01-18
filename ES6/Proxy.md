Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程。
Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，
因此提供了一种机制，可以对外界的访问进行过滤和改写。
Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。

ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例。

`const proxy = new Proxy(拦截对象,拦截行为)`

Proxy 对象的所有用法，都是上面这种形式，不同的只是handler参数的写法。
其中，new Proxy()表示生成一个Proxy实例，
  target参数表示所要拦截的目标对象，
  handler参数也是一个对象，用来定制拦截行为。

在 Proxy 代理的情况下，目标对象内部的this关键字会指向 Proxy 代理。

Proxy: 对外界的访问进行过滤和改写
相当于 对目标对象 加了一层防护，甚至可以 改变目标对象的本命

面向编程语言的编程

拦截操作，一共13种：
1. get(目标对象, 属性名, ? 当前Proxy 实例本身)
> 拦截对象属性的读取，比如proxy.foo和proxy['foo']。
  get方法可以继承。
  如果一个属性不可配置（configurable）和不可写（writable），则该属性不能被代理，通过 Proxy 对象访问该属性会报错。
```js
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
```js
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
**Proxy 对函数进行代理**
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