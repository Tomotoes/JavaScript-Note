process存在于全局对象上，不需要使用require()加载即可使用，

process模块主要做两方面的事情

- 获取进程信息（资源使用、运行环境、运行状态）
- 执行进程操作（监听事件、调度任务、发出警告）



### 资源使用

资源使用指运行此进程所消耗的机器资源。例如内存、cpu

#### 内存

```js
process.memoryUsage())

{ rss: 21848064,
  heapTotal: 7159808,
  heapUsed: 4431688,
  external: 8224 
 }
```

rss(常驻内存)的组成见下图

![img](https://user-gold-cdn.xitu.io/2018/5/30/163b10282fbb4e46?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

code segment对应当前运行的代码

external对应的是C++对象（与V8管理的JS对象绑定）的占用的内存，比如Buffer的使用

```js
Buffer.allocUnsafe(1024 * 1024 * 1000);
console.log(process.memoryUsage());

{ rss: 22052864,
  heapTotal: 6635520,
  heapUsed: 4161376,
  external: 1048584224 }
```

#### cpu

```js
const startUsage = process.cpuUsage();
console.log(startUsage);

const now = Date.now();
while (Date.now() - now < 500);

console.log(process.cpuUsage());
console.log(process.cpuUsage(startUsage)); //相对时间

// { user: 59459, system: 18966 }
// { user: 558135, system: 22312 }
// { user: 498432, system: 3333 }
```

user对应用户时间，system代表系统时间

### 运行环境

运行环境指此进程运行的宿主环境包括运行目录、node环境、CPU架构、用户环境、系统平台

#### 运行目录

```js
console.log(`Current directory: ${process.cwd()}`);

// Current directory: /Users/xxxx/workspace/learn/node-basic/process
```

#### node环境

```js
console.log(process.version)

// v9.1.0
```

如果不仅仅希望获得node的版本信息，还希望v8、zlib、libuv版本等信息的话就需要使用process.versions了

```js
console.log(process.versions);
{ http_parser: '2.7.0',
  node: '9.1.0',
  v8: '6.2.414.32-node.8',
  uv: '1.15.0',
  zlib: '1.2.11',
  ares: '1.13.0',
  modules: '59',
  nghttp2: '1.25.0',
  openssl: '1.0.2m',
  icu: '59.1',
  unicode: '9.0',
  cldr: '31.0.1',
  tz: '2017b' }
```

#### cpu架构

```js
console.log(`This processor architecture is ${process.arch}`);

// This processor architecture is x64
```

支持的值包括：`'arm'`, `'arm64'`, `'ia32'`, `'mips'`, `'mipsel'`, `'ppc'`, `'ppc64'`, `'s390'`, `'s390x'`, `'x32'` `'x64'`

#### 用户环境

```js
console.log(process.env.NODE_ENV); // dev

NODE_ENV=dev node b.js
```

除了启动时的自定义信息之外，process.env还可以获得其他的用户环境信息（比如PATH、SHELL、HOME等），感兴趣的可以自己打印一下试试

#### 系统平台

```js
console.log(`This platform is ${process.platform}`);

This platform is darwin
```

支持的系统平台包括：`'aix'` `'darwin'` `'freebsd'` `'linux'` `'openbsd'` `'sunos'` `'win32'`

android目前还处于试验阶段

### 运行状态

运行状态指当前进程的运行相关的信息包括启动参数、执行目录、主文件、PID信息、运行时间

#### 启动参数

获取启动参数有三个方法，execArgv获取Node.js的命令行选项（见[官网文档](https://link.juejin.im?target=https%3A%2F%2Fnodejs.org%2Fapi%2Fcli.html)）

argv获取非命令行选项的信息，argv0则获取argv[0]的值（略有差异)

```js
console.log(process.argv)
console.log(process.argv0)
console.log(process.execArgv)

node --harmony  b.js foo=bar --version

// 输出结果
[ '/Users/xiji/.nvm/versions/node/v9.1.0/bin/node',
  '/Users/xiji/workspace/learn/node-basic/process/b.js',
  'foo=bar',
  '--version' ]
node
[ '--harmony' ]
```

#### 执行目录

```js
console.log(process.execPath);

// /Users/xxxx/.nvm/versions/node/v9.1.0/bin/node
```

#### 运行时间

```js
var date = new Date();
while(new Date() - date < 500) {}
console.log(process.uptime()); // 0.569
```

#### 主文件

除了require.main之外也可以通过process.mainModule来判断一个模块是否是主文件

```js
//a.js
console.log(`module A: ${process.mainModule === module}`);

//b.js
require('./a');
console.log(`module B: ${process.mainModule === module}`);

node b.js
// 输出
module A: false
module B: true
```

PID信息

```js
console.log(`This process is pid ${process.pid}`); //This process is pid 12554
```

### 监听事件

process是EventEmiiter的实例对象，因此可以使用process.on('eventName', () => {})来监听事件。 常用的事件类型分两种：

- 进程状态 比如：beforeExit、exit、uncaughtException、message
- 信号事件 比如：SIGTERM、SIGKILL、SIGUSR1

beforeExit与exit的区别有两方面：

- beforeExit里面可以执行异步代码、exit只能是同步代码
- 手动调用process.exit()或者触发uncaptException导致进程退出不会触发beforeExit事件、exit事件会触发。

因此下面的代码console都不会被执行

```js
process.on('beforeExit', function(code) {
  console.log('before exit: '+ code);
});
process.on('exit', function(code) {
  setTimeout(function() {
    console.log('exit: ' + code);
  }, 0);
});
a.b();
```

当异常一直没有被捕获处理的话，最后就会触发'uncaughtException'事件。默认情况下，Node.js会打印堆栈信息到stderr然后退出进程。不要试图阻止uncaughtException退出进程，因此此时程序的状态可能已经不稳定了，建议的方式是及时捕获处理代码中的错误，uncaughtException里面只做一些清理工作。

**注意：node的9.3版本增加了process.setUncaughtExceptionCaptureCallback方法**

当process.setUncaughtExceptionCaptureCallback(fn)指定了监听函数的时候，uncaughtException事件将会不再被触发。

```js
process.on('uncaughtException', function() {
  console.log('uncaught listener');
});

process.setUncaughtExceptionCaptureCallback(function() {
  console.log('uncaught fn');
});

a.b();
// uncaught fn
```

message适用于父子进程之间发送消息，关于如何创建父子进程请参见[child_process模块解读](https://link.juejin.im?target=https%3A%2F%2Fjuejin.im%2Fpost%2F5b10a814f265da6e2a08a6f7)。

SIGTERM信号虽然也是用于请求终止Node.js进程，但是它与SIGKILL有所不同，进程可以选择响应还是忽略此信号。 SIGTERM会以一种友好的方式来结束进程，在进程结束之前先释放已分配的资源（比如数据库连接），因此这种方式被称为优雅关闭(graceful shutdown) 具体的执行步骤如下：

- 应用程序被通知需要关闭（接收到SIGTERM信号）
- 应用程序通知负载均衡不再接收新的请求
- 应用程序完成正在进行中的请求
- 释放资源（例如数据库连接）
- 应用程序正常退出，退出状态码为0

SIGUSR1 Node.js当接收到SIGUSR1信号时会启动内置的调试器，当执行下列操作时

```
kill -USR1 PID_OF_THE_NODE_JS_PROCESS
```

可以看到node.js会启动调试器代理，端口是9229

```js
server is listening 8089
Debugger listening on ws://127.0.0.1:9229/7ef98ccb-02fa-451a-8954-4706bd74105f
For help, see: https://nodejs.org/en/docs/inspector
```

也可以在服务启动时使用--inspect 来启动调试代理

```
node --inspect index.js
```

### 调度任务

process.nextTick(fn)

通过process.nextTick调度的任务是异步任务，EventLoop是分阶段的，每个阶段执行特定的任务，而nextTick的任务在阶段切换的时候就会执行，因此nextTick会比setTimeout(fn, 0)更快的执行，关于EventLoop见下图，后面会做进一步详细的讲解

![img](https://user-gold-cdn.xitu.io/2018/5/30/163b1038169007de?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 发出警告

```js
process.emitWarning('Something warning happened!', {
  code: 'MY_WARNING',
  type: 'XXXX'
});

// (node:14771) [MY_WARNING] XXXX: Something warning happened!
```

当type为DeprecationWarning时，可以通过命令行选项施加影响

- `--throw-deprecation`  会抛出异常
- `--no-deprecation`  不输出DeprecationWarning
- `--trace-deprecation` 打印详细堆栈信息

```js
process.emitWarning('Something warning happened!', {
  type: 'DeprecationWarning'
});
console.log(4);

node --throw-deprecation index.js
node --no-deprecation index.js
node --trace-deprecation index.js
```

 

 

 

 