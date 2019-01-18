### 单线程
单线程模型指的是，JavaScript 只在一个线程上运行。
也就是说，JavaScript 同时只能执行一个任务，其他任务都必须在后面排队等待。

注意，JavaScript 只在一个线程上运行，不代表 JavaScript 引擎只有一个线程。
事实上，JavaScript 引擎有多个线程，单个脚本只能在一个线程上运行（称为主线程），其他线程都是在后台配合。

为了利用多核 CPU 的计算能力，HTML5 提出 Web Worker 标准，允许 JavaScript 脚本创建多个线程，但是子线程完全受主线程控制，且不得操作 DOM。
所以，这个新标准并没有改变 JavaScript 单线程的本质。



### 任务队列
JavaScript 运行时，除了一个正在运行的主线程，引擎还提供多个任务队列（task queue），里面是各种需要当前程序处理的异步任务。
1. 首先，主线程会去执行所有的同步任务。
2. 等到同步任务全部执行完，就会去看任务队列里面的异步任务。
3. 如果满足条件，那么异步任务就重新进入主线程开始执行，这时它就变成同步任务了。
4. 等到执行完，下一个异步任务再进入主线程开始执行。
5. 一旦任务队列清空，程序就结束执行。

程序里面所有的任务，可以分成两类：同步任务（synchronous）和异步任务（asynchronous）。

同步任务是那些没有被引擎挂起、**在主线程上排队执行的任务**。
只有前一个任务执行完毕，才能执行后一个任务。

异步任务是那些被引擎放在一边，不进入主线程、而 **进入任务队列的任务。**
排在异步任务后面的代码，不用等待异步任务结束会马上运行，也就是说，**异步任务不具有”堵塞“效应。**
**不连续的操作就叫做异步**
而并发就是 **同时发起多个异步任务**

**同步任务总是比异步任务更早执行。**

异步任务可以分成两种。
  - 追加在本轮循环的异步任务
  - 追加在次轮循环的异步任务

**异步任务的写法通常是回调函数。**
一旦异步任务重新进入主线程，就会执行对应的回调函数。
如果一个异步任务没有回调函数，就不会进入任务队列，也就是说，不会重新进入主线程，因为没有用回调函数指定下一步的操作。

### 异步操作的模式
1. 回调函数
> 回调函数是异步操作最基本的方法。
回调函数的优点是简单、容易理解和实现，
缺点是不利于代码的阅读和维护，各个部分之间高度耦合（coupling），使得程序结构混乱、流程难以追踪（尤其是多个回调函数嵌套的情况），
而且每个任务只能指定一个回调函数。

2. 事件监听
> 采用事件驱动模式。异步任务的执行不取决于代码的顺序，而取决于某个事件是否发生。
这种方法的优点是比较容易理解，可以绑定多个事件，每个事件可以指定多个回调函数，而且可以”去耦合“（decoupling），有利于实现模块化。
缺点是整个程序都要变成事件驱动型，运行流程会变得很不清晰。阅读代码的时候，很难看出主流程。

3. 发布/订阅
> 事件完全可以理解成”信号“，如果存在一个”信号中心“，某个任务执行完成，就向信号中心”发布“（publish）一个信号，其他任务可以向信号中心”订阅“（subscribe）这个信号，从而知道什么时候自己可以开始执行。
> 这就叫做”发布/订阅模式”（publish-subscribe pattern），又称“观察者模式”（observer pattern）。
> 这种方法的性质与“事件监听”类似，但是明显优于后者。
> 因为可以通过查看“消息中心”，了解存在多少信号、每个信号有多少订阅者，从而监控程序的运行。

### 事件循环
JavaScript 引擎怎么知道异步任务有没有结果，能不能进入主线程呢？
答案就是引擎在不停地检查，一遍又一遍，只要同步任务执行完了，引擎就会去检查那些挂起来的异步任务，是不是可以进入主线程了。
这种循环检查的机制，就叫做事件循环（Event Loop）。
维基百科的定义是：**事件循环是一个程序结构，用于等待和发送消息和事件**

首先，有些人以为，除了主线程，还存在一个单独的事件循环线程。
不是这样的，**只有一个主线程，事件循环是在主线程上完成的。**

#### Node
Node 开始执行脚本时，会先进行事件循环的初始化，但是这时事件循环还没有开始，会先完成下面的事情。
  1. 同步任务
  2. 发出异步请求
  3. 规划定时器生效的时间
  4. 执行process.nextTick()等等

最后，上面这些事情都干完了，事件循环就正式开始了。

**事件循环会无限次地执行，一轮又一轮。**
只有异步任务的回调函数队列清空了，才会停止执行。

每一轮的事件循环，分成六个阶段。这些阶段会依次执行。
  - timers
  - I/O callbacks
  - idle handlers
  - prepare handlers
  - I/O poll
  - Check Handlers
  - Close Handlers
**每个阶段都有一个先进先出的回调函数队列。**
**只有一个阶段的回调函数队列清空了，该执行的回调函数都执行了，事件循环才会进入下一个阶段。**

1. timers
> 这个是定时器阶段，处理setTimeout()和setInterval()的回调函数。
进入这个阶段后，主线程会检查一下当前时间，是否满足定时器的条件。如果满足就执行回调函数，否则就离开这个阶段。

2. I/O callbacks
> 除了以下操作的回调函数，其他的回调函数都在这个阶段执行。
- setTimeout()和setInterval()的回调函数
- setImmediate()的回调函数
- 用于关闭请求的回调函数，比如socket.on('close', ...)

3. idle handlers
> 该阶段只供 libuv 内部调用，这里可以忽略。

4. prepare handlers
> 一些 poll阶段之前的前置工作，这里可以忽略。

5. I/O poll
> 这个阶段是轮询时间，用于等待还未返回的 I/O 事件，比如服务器的回应、用户移动鼠标等等。

*这个阶段的时间会比较长。*
*如果没有其他异步任务要处理（比如到期的定时器），会一直停留在这个阶段，等待 I/O 请求返回结果。*

6. Check Handlers
> 一些 poll阶段之前的检查工作，该阶段执行setImmediate()的回调函数。

7. Close Handlers
> 该阶段执行关闭请求的回调函数，比如socket.on('close', ...)。

```js
const fs = require('fs');

const timeoutScheduled = Date.now();

// 异步任务一：100ms 后执行的定时器
setTimeout(() => {
  const delay = Date.now() - timeoutScheduled;
  console.log(`${delay}ms`);
}, 100);

// 异步任务二：文件读取后，有一个 200ms 的回调函数
fs.readFile('test.js', () => {
  const startCallback = Date.now();
  while (Date.now() - startCallback < 200) {
    // 什么也不做
  }
});
```
第一轮事件循环，没有到期的定时器，也没有已经可以执行的 I/O 回调函数，所以会进入 `Poll` 阶段，等待内核返回文件读取的结果。
由于读取小文件一般不会超过 100ms，所以在定时器到期之前，Poll 阶段就会得到结果，因此就会继续往下执行。

第二轮事件循环，依然没有到期的定时器，但是已经有了可以执行的 I/O 回调函数，所以会进入 `I/O callbacks` 阶段，执行fs.readFile的回调函数。
这个回调函数需要 200ms，也就是说，在它执行到一半的时候，100ms 的定时器就会到期。
**但是，必须等到这个回调函数执行完，才会离开这个阶段。**

第三轮事件循环，已经有了到期的定时器，所以会在 timers 阶段执行定时器。最后输出结果大概是200多毫秒。

### Node 的异步

为了协调异步任务，Node 居然提供了四个定时器，让任务可以在指定的时间运行。

- setTimeout()
- setInterval()
- setImmediate()
- process.nextTick()
前两个是语言的标准，后两个是 Node 独有的。它们的写法差不多，作用也差不多，不太容易区别。

#### 执行顺序
Node 规定，process.nextTick和Promise的回调函数，追加在本轮循环，即同步任务一旦执行完成，就开始执行它们。
而setTimeout、setInterval、setImmediate的回调函数，追加在次轮循环。

1. 同步任务
2. process.nextTick()
3. 微任务

```js
process.nextTick(() => console.log(1));
Promise.resolve().then(() => console.log(2));
process.nextTick(() => console.log(3));
Promise.resolve().then(() => console.log(4));
// 1
// 3
// 2
// 4
```

#### API
1. process.nextTick 
> 这个名字有点误导，它是在本轮循环执行的，而且是所有异步任务里面最快执行的。
Node 执行完所有同步任务，接下来就会执行process.nextTick的任务队列。

process.nextTick 它指定的任务总是发生在所有异步任务之前。

**nextTickQueue**
process.nextTick这个名字有点误导，它是在本轮循环执行的，而且是所有异步任务里面最快执行的。
Node 执行完所有同步任务，接下来就会执行process.nextTick的任务队列。

**microTaskQueue**
根据语言规格，Promise对象的回调函数，会进入异步任务里面的"微任务"（microtask）队列。
微任务队列追加在process.nextTick队列的后面，也属于本轮循环。

immediate 即时
2. setImmediate
process.nextTick和setImmediate的一个重要区别：
  - 多个process.nextTick语句总是在当前"执行栈"一次执行完，
  - 多个setImmediate可能则需要多次loop才能执行完。

由于process.nextTick指定的回调函数是在本次"事件循环"触发，而setImmediate指定的是在下次"事件循环"触发，
所以很显然，前者总是比后者发生得早，而且执行效率也高（因为不用检查"任务队列"）。

3. SetTimeout
**因为setTimeout的第二个参数默认为0。**
但是实际上，Node 做不到0毫秒，最少也需要1毫秒， 根据官方文档，第二个参数的取值范围在1毫秒到2147483647毫秒之间。
也就是说，**setTimeout(f, 0)等同于setTimeout(f, 1)。**

实际执行的时候，进入事件循环以后，有可能到了1毫秒，也可能还没到1毫秒，取决于系统当时的状况。
如果没到1毫秒，那么 timers 阶段就会跳过，进入 check 阶段，先执行setImmediate的回调函数。

由于setTimeout在 timers 阶段执行，而setImmediate在 check 阶段执行。
所以，setTimeout会早于setImmediate完成。

**例外**
```js

const fs = require('fs');

fs.readFile('test.js', () => {
  setTimeout(() => console.log(1));
  setImmediate(() => console.log(2));
});
```
上面代码会先进入 I/O callbacks 阶段，然后是 check 阶段，最后才是 timers 阶段。
因此，setImmediate才会早于setTimeout执行。

一般都是先从 `I/O poll` 阶段开始哟