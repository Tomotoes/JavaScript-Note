**纯对象**
let obj = Object.create(null);

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
ES6 引入 new.target,向元编程迈进一小步

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

**Reflect.ownKeys(obj)**
> 返回一个数组，包含对象自身的所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。
