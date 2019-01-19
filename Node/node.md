### 概念
Node是**JavaScript语言的服务器运行环境**

所谓“运行环境”有两层意思：
- 首先，JavaScript语言通过Node在服务器运行，在这个意义上，Node有点像JavaScript虚拟机；
- 其次，Node提供大量工具库，使得JavaScript语言与操作系统互动（比如读写文件、新建子进程），
    在这个意义上，Node又是JavaScript的工具库。

Node内部采用Google公司的V8引擎，作为JavaScript语言解释器；

通过自行开发的libuv库，调用操作系统资源。

Node采用V8引擎处理JavaScript脚本，最大特点就是单线程运行，一次只能运行一个任务。
这导致Node大量采用异步操作（asynchronous operation），即任务不是马上执行，而是插在任务队列的尾部，等到前面的任务运行完后再执行。

由于这种特性，某一个任务的后续操作，往往采用回调函数（callback）的形式进行定义。
Node约定，如果某个函数需要回调函数作为参数，则回调函数是最后一个参数。
另外，**回调函数本身的第一个参数，约定为上一步传入的错误对象。**
一旦异步操作发生错误，就把错误对象传递到回调函数。
```js
db.query(data,options,callback(err,data)=>{
  assert(err,null)
})
```

如果没有发生错误，回调函数的第一个参数就传入null。
这种写法有一个很大的好处，就是说只要判断回调函数的第一个参数，就知道有没有出错，如果不是null，就肯定出错了。
另外，这样还可以层层传递错误。

### 语法
require 加载模块时，可以省略其后缀名

```js
// foo.js

module.exports = function(x) {
    console.log(x);
};

// index.js

var m = require('./foo');

m("这是自定义模块");

```

一般来说，Node有三种方法，传播一个错误。

使用throw语句抛出一个错误对象，即抛出异常。
将错误对象传递给回调函数，由回调函数负责发出错误。
通过EventEmitter接口，发出一个error事件。


process与buffer 是 node的一个全局对象

```js
const EventEmitter = require('events').EventEmitter
const emitter = new EventEmitter()
```
newListener事件：添加新的回调函数时触发。
removeListener事件：移除回调时触发。
emitter.on(name, f) 对事件name指定监听函数f
emitter.addListener(name, f) addListener是on方法的别名
emitter.once(name, f) 与on方法类似，但是监听函数f是一次性的，使用后自动移除
emitter.listeners(name) 返回一个数组，成员是事件name所有监听函数
emitter.removeListener(name, f) 移除事件name的监听函数f
emitter.removeAllListeners(name) 移除事件name的所有监听函数

**process.stdout.write === console.log**

```js
var fs = require('fs');
var zlib = require('zlib');

fs.createReadStream('wow.txt')
  .pipe(zlib.createGzip())
  .pipe(process.stdout);
```
上面代码通过pipe方法，先将文件数据压缩，然后再导向标准输出。

全局对象
global.warning = true;

所有代码都运行在模块作用域，不会污染全局作用域。
```js
var a = require('./a');
a.on('ready', function() {
  console.log('module a is ready');
});
```


require命令的基本功能是，读入并执行一个JavaScript文件，然后返回该模块的exports对象。
如果没有发现指定模块，会报错。
```js
// example.js
var invisible = function () {
  console.log("invisible");
}

exports.message = "hi";

exports.say = function () {
  console.log(message);
}

运行下面的命令，可以输出exports对象。

var example = require('./example.js');
example
// {
//   message: "hi",
//   say: [Function]
// }

如果模块输出的是一个函数，那就不能定义在exports对象上面，而要定义在module.exports变量上面。

module.exports = function () {
  console.log("hello world")
}

require('./example2.js')()
```


CommonJS规范规定，每个模块内部，module变量代表当前模块。
这个变量是一个对象，它的exports属性（即module.exports）是对外的接口。
加载某个模块，其实是加载该模块的module.exports属性。

module.id 模块的识别符，通常是带有绝对路径的模块文件名。
module.filename 模块的文件名，带有绝对路径。
module.loaded 返回一个布尔值，表示模块是否已经完成加载。
module.parent 返回一个对象，表示调用该模块的模块。
module.children 返回一个数组，表示该模块要用到的其他模块。
module.exports 表示模块对外输出的值。


为了方便，Node为每个模块提供一个exports变量，指向module.exports。
这等同在每个模块头部，有一行这样的命令。
> var exports = module.exports;

造成的结果是，在对外输出模块接口时，可以向exports对象添加方法。
```js
exports.area = function (r) {
  return Math.PI * r * r;
};

exports.circumference = function (r) {
  return 2 * Math.PI * r;
};

注意，不能直接将exports变量指向一个值，因为这样等于切断了exports与module.exports的联系。
exports = function(x) {console.log(x)};
```

path.join方法用于连接路径。
该方法的主要用途在于，会正确使用当前系统的路径分隔符，Unix系统是”/“，Windows系统是”\“。

path.resolve方法用于将相对路径转为绝对路径。
它可以接受多个参数，依次表示所要进入的路径，直到将最后一个参数转为绝对路径。如果根据参数无法得到绝对路径，就以当前所在路径作为基准。除了根目录，该方法的返回值都不带尾部的斜杠。

path.relative方法接受两个参数，这两个参数都应该是绝对路径。该方法返回第二个路径相对于第一个路径的那个相对路径。
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb')
// '../../impl/bbb'

path.parse()方法可以返回路径各部分的信息。
```js
var myFilePath = '/someDir/someFile.json';
path.parse(myFilePath).base
// "someFile.json"
path.parse(myFilePath).name
// "someFile"
path.parse(myFilePath).ext
// ".json"
```

\# !/usr/bin/env node

> 表示用node来执行这个文件 ,在特定项目下，这条语句必须添加

```js
const fs = require('fs');
const child_process = require('child_process');
 
for(var i=0; i<3; i++) {
   var workerProcess = child_process.spawn('node', ['support.js', i]);
 
   workerProcess.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
   });
 
   workerProcess.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
   });
 
   workerProcess.on('close', function (code) {
      console.log('子进程已退出，退出码 '+code);
   });
}
```