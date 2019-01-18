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
