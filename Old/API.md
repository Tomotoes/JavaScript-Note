### arr.sort(compareFunction)
> 如果没有指明 compareFunction ，那么元素会按照转换为的字符串的诸个字符的Unicode位点进行排序。
```js
[1,3,100].sort() => [1,100,3]

<!-- 升序 -->
[1,3,100].sort((a,b)=>a-b)

<!-- 降序 -->
[1,3,100].sort((a,b)=>b-a)
```

### arr.reduce([callback, initialValue])
1. callback
> 执行数组中每个值的函数，包含四个参数:
  - previousValue
  > 上一次调用回调函数返回的值，或者是提供的初始值（initialValue）
  - currentValue
  > 数组中当前被处理的元素
  - currentIndex
  > 当前被处理元素在数组中的索引, 即currentValue的索引.如果有initialValue初始值, 从0开始.如果没有从1开始.
  - array
  > 调用 reduce 的数组

2. initialValue
> 可选参数, 作为第一次调用 callback 的第一个参数。

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
​```js
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

1. startsWith(搜索字符，开始搜索的位置)

> 返回布尔值，表示参数字符串是否在原字符串的头部。

1. endsWith(搜索字符，开始搜索的位置)

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

