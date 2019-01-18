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
  const parsed = JSON.parse(body)
  console.log('got', parsed)
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