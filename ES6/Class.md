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
