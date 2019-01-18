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
