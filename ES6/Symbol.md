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