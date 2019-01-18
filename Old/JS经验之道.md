

函数式判断 对象存在特定属性 

> Reflect.has(对象,'属性名')

> 对象.hasOwnProperty('属性名')



RC=Release Candidate,含义是"发布候选版"，它不是最终的版本，而是最终版(RTM=Release To Manufacture)之前的最后一个版本。

广义上对测试有三个传统的称呼：alpha、beta、gamma，用来标识测试的阶段和范围。

alpha 是指内测，即现在说的CB，指开发团队内部测试的版本或者有限[用户体验测试](https://baike.baidu.com/item/%E7%94%A8%E6%88%B7%E4%BD%93%E9%AA%8C%E6%B5%8B%E8%AF%95)版本。

beta 是指公测，即针对所有用户公开的测试版本。

然后做过一些修改，成为正式发布的候选版本时叫做gamma，现在叫做RC（Release Candidate）。 





函数式 删除属性

Reflect.deleteProperty(obj,'name')



```js
关闭 eslint
/* eslint-disable */

关闭 eslint 某条规则
/* eslint-disable 规则名 */
```



数组增加元素：`Array.splice(index,0,value)`

数组删除元素：`Array.splice(index,1)`



local/sessionStroage 直接赋值属性，进行存储

```js
localStroage.属性名=属性值
localStroage.setItem(属性名,属性值)
```



对象解构赋值，解构父子属性

```js
const {a,a:{b}} = obj
```



从浏览器缓存加载网页，不会触发load事件。

如果有每次加载（包括第一次加载）都要执行的代码，可以使用pageshow事件。 

另一方面，一旦使用unload事件，网页就不会被浏览器缓存。

如果不希望这样，可以使用pagehide事件，保证每次网页卸载，代码都会执行。 



**URL.createObjectURL()** 静态方法会创建一个 [`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString)，其中包含一个表示参数中给出的对象的URL。这个 URL 的生命周期和创建它的窗口中的 [`document`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document) 绑定。这个新的URL 对象表示指定的 [`File`](https://developer.mozilla.org/zh-CN/docs/Web/API/File) 对象或 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 对象。  



#### 获取用户地理位置 API

navigator.geolocation返回一个geolocation对象，该对象有一个方法getCurrentPosition()，该方法是一个异步请求，会去调Google的api， 所以可能需要翻墙，调用方法：

```js
navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
```

successCallback定位成功后回调，返回一个position对象，其大概结构是这样的： ![geolocation对象](http://p8rbt50i2.bkt.clouddn.com/blogWX20180528-105336.png)

```js
coords.latitude: 十进制数的纬度

coords.longitude: 十进制数的经度

coords.accuracy: 位置精度

coords.altitude: 海拔，海平面以上以米计

coords.altitudeAccuracy: 位置的海拔精度

coords.heading: 方向，从正北开始以度计

coords.speed: 速度，以米/每秒计

timestamp: 响应的日期/时间
```

errorCallback定位失败时返回错误信息，大致这样：

![geolocation对象](http://p8rbt50i2.bkt.clouddn.com/WX20180528-110527.png)

```js
code: 错误编码：
		1: 用户禁止了定位信息获取，
		2: 为网络不可用或连接卫星失败，
		3: 为获取定位所花费的时间过长，
		0: 为出现未知错误

message: 错误信息
```

options是一些设置参数，可以设置最大超时时间等。

```js
{
  	enableHighAccuracy: true, //是否尝试更精确地读取纬度和经度，移动设备上，这可能要使用手机上的GPS，这会消耗移动设备更多的电量，定位所需时间也会更长，默认为false
  	maximumAge: 30000,  //缓存时间
  	timeout: 27000 //等待响应的最大时间，默认是0毫秒，表示无穷时间
}
```

除此之外，navigator.geolocation还有两个有用的方法：watchPosition和clearWatch。 前者是一个跟踪器，可根据设备的地理位置异步返回实时位置信息，实现实时位置追踪，调用方式与getCurrentPosition一样。 该方法返回唯一的watcher ID，可用clearWatch(ID)关掉追，有点像setInterval和clearInterval的工作方式。

```js
var watcherId = navigator.geolocation.watchPosition(successCallback, errorCallback, options); //启动追踪

navigator.geolocation.clearWatch(watcherId); //关闭追踪
```



获取当前网络状态的API : `onLine` 和 `connection`

1. navigator.onLine (Boolean):

> 判断设备是否连接上网络。

2. online、offline事件

通常绑定在window上，当设备有网和没网之间切换时触发。

```js
var online = navigator.onLine;  //是否在线
//事件绑定
window.addEventListener('online',  updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
```

3.navigator.connection

- type

  > 网络类型

```js
bluetooth: 蓝牙
cellular: 蜂窝网络(e.g., EDGE, HSPA, LTE, etc.)
ethernet: 以太网
none: 无连接
mixed: 多类型混合
other: 类型可知，但不可枚举
unknown: 有链接，但类型未知
wifi: Wi-Fi
wimax: WiMAX
```

- effectiveType

  > 有效连接类型

```js
'2g'
'3g'
'4g'
'slow-2'
```

- downlin

  > 有效带宽，M/s

- downlinkMax

  > 下行最大比特率

- rtt:

  > 往返时间（round-trip time）：表示从发送端发送数据开始，到发送端收到来自接收端的确认
  >
  > （接收端收到数据后便立即发送确认，不包含数据传输时间）总共经历的时间。

4. connection.onchange

> 当设备网络连接类型发生变化时触发该事件





递归的性能很差，所以 一般是使用尾递归来优化代码，也就是把函数的计算的状态当作参数一层层的往下传递

这样 编译器就不需要函数栈来帮你保存函数的内部变量的状态了

Y combinator只是证明lambda演示式同样能递归。 

匿名函数（箭头函数）应该怎么尾递归呢？

我们可以 **匿名函数当作一个参数传递给另外一个函数，因为函数的参数有名字，所以就可以递归调用自己了**

```js
const fact = (func, n) => ( n==0 ? 1 :  n * func(func, n-1) )
fact(fact, 5)
```



`reduce` 与 `reduceRight` 的第二个参数 是默认值 

`reduceRight` 是从右向左遍历

而 `forEach` `map` `every` `some` `filter` 第二个参数是 函数内部的this

`contact` 返回新元素添加之后的数组



循环定义目标对象的函数

之前的做法

```js
// 例子1
const result = {}
logs.forEach(e => {
  result[e.type] = text => { log(toLog.call(e).call(null, text)) }
})
return result

//例子2
const tip = {}
Array.prototype.forEach.call(['info', 'success', 'warning', 'error'],type => {
	tip[type] = (msg, duration = 1500) => {
		return Promise.resolve(Message({
			message: msg,
			type: type,
			duration: duration,
			...config
		}))
	}
})
export default tip

```



使用 reduce，可以更完美的实现 循环定义目标对象

```jsx
array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
返回计算结果
第一个参数函数的返回结果会作为，下一次遍历的第一个参数

const sizes = {
  desktop: 992,
  tablet: 768,
  phone: 376
}

const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = args => css`
    @media (max-width: ${sizes[label] / 16}em) {
      ${css(...args)}
    }
  `
  return acc
}, {})

const Content = styled.div`
  height: 3em;
  width: 3em;
  background: papayawhip;

  /* Now we have our methods on media and can use them instead of raw queries */
  ${media.desktop`background: dodgerblue;`}
  ${media.tablet`background: mediumseagreen;`}
  ${media.phone`background: palevioletred;`}
`;

render(
  <Content />
);

```



```js
function say(str){console.log(str)}
say`I am ${name} wqe`
VM186:1 (2) ["I am ", " wqe", raw: Array(2)]
```



数组 API

1. lastIndexOf

   > indexOf 的贪婪模式，不到最后一个不会停下来

1. every

   > 判断数组中的每个元素时候是符合条件

1. some

   > 如果说 every 是 && 的话，some 就是 ||



vuex `mutation` 只能接收一个参数，如果有多个参数，请组合成对象，再传递



数值产量不能按照普通的方式 调用方法与属性，因为 `.` 运算符会被当成 数值中的小数点解析

正确方式

```js
Number.prototype.padStart = function(length,char){
  const value = String(this)
  if(value.length >= length){
    return value
  }
  const gap = length - value.length
  return char.repeat(gap) + value
}
10['padStart'](5,'0')
```



Math.ceil 向上取整

Math.floor 向下取整



不用加号求出两数之和

```js
1. const add = (a, b) => new Function('a', 'b', `return ${a} ${String.fromCharCode(43)} ${b}`)(a,b) 

2. 位运算
```

@vue/cli-plugin-babel@3.0.0-beta.11  @vue/cli-plugin-pwa@3.0.0-beta.11 @vue/cli-service@3.0.0-beta.11 

无法利用 类型转换把字符转换成 ASICII 码值的，全都是 NAN

不过有对应的 API

```js
字符转ascii码:charCodeAt(); 
ascii码转字符:用fromCharCode()

"a".charCodeAt() 97
String.fromCharCode(97) "a"
```

```js
stringObject.charCodeAt(index)
index	必需。表示字符串中某个位置的数字，即字符在字符串中的下标。
```



```js
"a".repeat(5) === Array(5+1).join("a")
```



split 方法用于把一个字符串分割成字符串数组

```js
split(字符串或正则表达式,指定返回的数组的最大长度)
const str = "qweasdzxc"
str.split('',2)
>> ["q","w"]
  
// 如果分割符为 空字符，可转换为一个数组
str.split('')
Array.from(str)
[...str]
```



node的全局this会指向module.exports，函数中的this会指向global 

浏览器环境中的全局 this 当然是 window



冷知识

数组的遍历API：forEach map

支持第二个参数，也就是第一个参数（函数）的运行上下文



```js
"scripts": {
  "debug": "NODE_ENV=debug npm test",
}
const isDebug = process.env.NODE_ENV === 'debug'
```

项目运行时，可以通过设置 `NODE_ENV` 变量来区别环境



```js
const str="my name is simon"
str[0]='a'
str //"my name is simon"
```

字符串的值是不可变的



表单元素自带 `reset` 方法哦



**router.replace(location, onComplete?, onAbort?)**

vue-router 的 push 与 replace 是有回调函数的！！！

tag（标签名） ， replace（替换） ， append（将当前路径看作基路径）



button

```html
<input type="button" value="显示文本" />

<button>显示文本</button>
```



新名词，纯函数

不会改变参数的值



非纯函数

会改变参数的值



```js
Array.concat(item) 返回增加元素之后的数组
Array.push(item) 将元素增加到数组尾，返回增加元素之后的数组长度
Array.pop() 返回尾部删除的元素
Array.unshift() 将元素增加到数组头，返回增加元素之后的数组长度
Array.shift() 返回头部删除的元素

const brr = [1,2,3]
brr.slice(-1)
[3]
brr.slice(1)
[2, 3]
```



```js
const getName = () => (
	"Simon"
)
getName()
>> "Simon"

function say(){
  return (
  	"say"
  )
}
say()
```

(expression) 返回一个表达式

**可以多行输入~**



```js
const isLoggedIn = status &&
      
      
      "isLoggedIn"

isLoggedIn === "isLoggedIn"
```

今天才知道 与运算符 `&&` 另一个表达式可以换行表示~



```js
const value = 
      
      
      "sad"
value === "sad"  >> true
```

等号后面也是可以加换行的



```js
Promise.resolve(func)
	.then(e=>{})
	.catch
	.finally()
```

方法调用也是可以换行的



```jsx
// hello.js
export default const el = <h1>Hello World</h1>
export const GetEl = () => el

//index.js
import el,{GetEl} from './'
```



eslint 使用命令行 检查文件规范

> eslint --ext .js,.vue src

eslint 使用命令行 修改文件规范

> eslint --fix js server 

使用大的常数时，10000 最好写成科学记数法 1e7

```js
var v=[];
for(let i=0; i<1e7; i++) v.push(i);
[...v]
```



Promise.all([asyncFuncs]).then(e=>{})

> 此时的 e 为方法返回的结果组成的数组



Promise.all(同步方法) 

> 顺序执行

Promise.all(同步，异步)

> 以同步为基准

Promise.all(异步)

> 真正的并发执行



请求图片 并下载到本地

**因为 request本身就是 stream 对象**

读取流.pipe(写入流)

```js
 const req = request.get(imgUrl).set({ 'Referer': 'http://www.mmjpg.com' }) 

  req.pipe(fs.createWriteStream(path.join(__dirname, 'mm', dir, filename)))
```



测试代码运行速度 最常用的方式就是在 代码之前使用 console.time API

```js
console.time(计时器名字)
// do something...
console.timeEnd(计时器名字)
```



<a>元素有一系列 URL 相关属性，可以用来操作链接地址。这些属性的含义，可以参见Location对象的实例属性。

hash：片段识别符（以#开头）
host：主机和端口（默认端口80和443会省略）
hostname：主机名
href：完整的 URL
origin：协议、域名和端口
password：主机名前的密码
pathname：路径（以/开头）
port：端口
protocol：协议（包含尾部的冒号:）
search：查询字符串（以?开头）
username：主机名前的用户名

```js
// HTML 代码如下
// <a id="test" href="http://user:passed@example.com:8081/index.html?bar=1#foo">test</a>
var a = document.getElementById('test');
a.hash // "#foo"
a.host // "example.com:8081"
a.hostname // "example.com"
a.href // "http://user:passed@example.com:8081/index.html?bar=1#foo"
a.origin // "http://example.com:8081"
a.password // "passwd"
a.pathname // "/index.html"
a.port // "8081"
a.protocol // "http:"
a.search // "?bar=1"
a.username // "user"
除了origin属性是只读的，上面这些属性都是可读写的。
```
1. download 
> 表示当前链接不是用来浏览，而是用来下载的。它的值是一个字符串，表示用户下载得到的文件名。

2. hreflang
> 用来读写<a>元素的 HTML 属性hreflang，表示链接指向的资源的语言，比如hreflang="en"。


### location
Location对象是浏览器提供的原生对象，提供 URL 相关的信息和操作方法。通过window.location和document.location属性，可以拿到这个对象。
Location对象提供以下属性。

  Location.href：整个 URL。
  Location.protocol：当前 URL 的协议，包括冒号（:）。
  Location.host：主机，包括冒号（:）和端口（默认的80端口和443端口会省略）。
  Location.hostname：主机名，不包括端口。
  Location.port：端口号。
  Location.pathname：URL 的路径部分，从根路径/开始。
  Location.search：查询字符串部分，从问号?开始。
  Location.hash：片段字符串部分，从#开始。
  Location.username：域名前面的用户名。
  Location.password：域名前面的密码。
  Location.origin：URL 的协议、主机名和端口。

这些属性里面，只有origin属性是只读的，其他属性都可写。

1. location.assign()
> 接受一个 URL 字符串作为参数，使得浏览器立刻跳转到新的 URL。如果参数不是有效的 URL 字符串，则会报错。
```js
// 跳转到新的网址
document.location.assign('http://www.example.com')
```

2. Location.replace()
> 受一个 URL 字符串作为参数，使得浏览器立刻跳转到新的 URL。如果参数不是有效的 URL 字符串，则会报错。

它与assign方法的差异在于，replace会在浏览器的浏览历史History里面删除当前网址，
也就是说，一旦使用了该方法，后退按钮就无法回到当前网页了，相当于在浏览历史里面，使用新的 URL 替换了老的 URL。
它的一个应用是，当脚本发现当前是移动设备时，就立刻跳转到移动版网页。

3. Location.reload()
> reload方法使得浏览器重新加载当前网址，相当于按下浏览器的刷新按钮。

它接受一个布尔值作为参数。
如果参数为true，浏览器将向服务器重新请求这个网页，并且重新加载后，网页将滚动到头部（即scrollTop === 0）。
如果参数是false或为空，浏览器将从本地缓存重新加载该网页，并且重新加载后，网页的视口位置是重新加载前的位置。

### url
URL对象本身是一个构造函数，可以生成 URL 实例。
它接受一个表示 URL 的字符串作为参数。如果参数不是合法的 URL，会报错。
如果参数是另一个 URL 实例，构造函数会自动读取该实例的href属性，作为实际参数。
如果 URL 字符串是一个相对路径，那么需要表示绝对路径的第二个参数，作为计算基准。
```js
var url1 = new URL('index.html', 'http://example.com');
url1.href
// "http://example.com/index.html"

var url2 = new URL('page2.html', 'http://example.com/page1.html');
url2.href
// "http://example.com/page2.html"

var url3 = new URL('..', 'http://example.com/a/b.html')
url3.href
// "http://example.com/"
```
URL 实例的属性与Location对象的属性基本一致，返回当前 URL 的信息。
URL.searchParams：返回一个URLSearchParams实例，该属性是Location对象没有的
```js
var url = new URL('http://example.com/?foo=1');
url.searchParams.get('foo') // "1"
```


URL.createObjectURL(file)
> 用来为上传/下载的文件、流媒体文件生成一个 URL 字符串。这个字符串代表了File对象或Blob对象的 URL。

URL.revokeObjectURL(url)
> 用来释放URL.createObjectURL方法生成的 URL 实例。它的参数就是URL.createObjectURL方法返回的 URL 字符串。
`img.onload = function() { window.URL.revokeObjectURL(this.src); }`

### URLSearchParams
> 浏览器的原生对象，用来构造、解析和处理 URL 的查询字符串。

```js
// 方法一：传入字符串
var params = new URLSearchParams('?foo=1&bar=2');
// 等同于
var params = new URLSearchParams(document.location.search);

// 方法二：传入数组
var params = new URLSearchParams([['foo', 1], ['bar', 2]]);

// 方法三：传入对象
var params = new URLSearchParams({'foo' : 1 , 'bar' : 2});
```

URLSearchParams实例有遍历器接口，可以用for...of循环遍历
如果直接对URLSearchParams进行遍历，其实内部调用的就是entries接口。
```js
var url = new URL('https://example.com?foo=1&bar=2');
var params = new URLSearchParams(url.search);

params.toString() // "foo=1&bar=2'
```
1. URLSearchParams.append()
> append方法用来追加一个查询参数。它接受两个参数，第一个为键名，第二个为键值，没有返回值。
```js
var params = new URLSearchParams({'foo': 1 , 'bar': 2});
params.append('baz', 3);
params.toString() // "foo=1&bar=2&baz=3"
```

2. URLSearchParams.delete()
> delete方法用来删除指定的查询参数。它接受键名作为参数。
```js
var params = new URLSearchParams({'foo': 1 , 'bar': 2});
params.delete('bar');
params.toString() // "foo=1"
```

3. URLSearchParams.has()
> has方法返回一个布尔值，表示查询字符串是否包含指定的键名。
```js
var params = new URLSearchParams({'foo': 1 , 'bar': 2});
params.has('bar') // true
params.has('baz') // false
```

4. URLSearchParams.set()
> set方法用来设置查询字符串的键值。
```js
var params = new URLSearchParams('?foo=1');
params.set('foo', 2);
params.toString() // "foo=2"
params.set('bar', 3);
params.toString() // "foo=2&bar=3"
```

5. URLSearchParams.get()，URLSearchParams.getAll()
```js
var params = new URLSearchParams('?foo=1');
params.get('foo') // "1"
params.get('bar') // null

getAll方法返回一个数组，成员是指定键的所有键值。它接受键名作为参数。

var params = new URLSearchParams('?foo=1&foo=2');
params.getAll('foo') // ["1", "2"]
```
两个地方需要注意。第一，它返回的是字符串，如果原始值是数值，需要转一下类型；第二，如果指定的键名不存在，返回值是null。

如果有多个的同名键，get返回位置最前面的那个键值。

var params = new URLSearchParams('?foo=3&foo=2&foo=1');
params.get('foo') // "3"

6. URLSearchParams.sort()
> sort方法对查询字符串里面的键进行排序，规则是按照 Unicode 码点从小到大排列。

该方法没有返回值，或者说返回值是undefined。
```js
var params = new URLSearchParams('c=4&a=2&b=3&a=1');
params.sort();
params.toString() // "a=2&a=1&b=3&c=4"
```

7. URLSearchParams.keys()，URLSearchParams.values()，URLSearchParams.entries()
> 这三个方法都返回一个遍历器对象，供for...of循环消费。
它们的区别在于，keys方法返回的是键名的遍历器，values方法返回的是键值的遍历器，entries返回的是键值的遍历器。


document.images
const img = new Image(width,height)
HTMLImageElement.currentSrc
> 返回当前正在展示的图像的网址。JavaScript 和 CSS 的 mediaQuery 都可能改变正在展示的图像。
HTMLImageElement.naturalWidth
> 表示图像的实际宽度（单位像素）
HTMLImageElement.naturalHeight
> 表示实际高度。这两个属性返回的都是整数。
HTMLImageElement.complete
> 返回一个布尔值，表示图表是否已经加载完成。如果<img>元素没有src属性，也会返回true。
HTMLImageElement.x
> 返回图像左上角相对于页面左上角的横坐标，HTMLImageElement.y属性返回纵坐标。

DOM 操作里面，有五个方法可以取得一个元素节点的内容。

最常用的 innerHTML 其实是最慢的，其次是 textContent。
根本想不到，最快的方法是 http://firstChild.data ，这里的 firstChild 是文本节点。速度相差10倍啊！

1. document.querySelector('h2').firstChild.data
2. document.querySelector('h2').firstChild.nodeValue
3. document.querySelector('h2').innerText
4. document.querySelector('h2').testContent
5. document.querySelector('h2').innerHTML

单线程模型指的是，JavaScript 只在一个线程上运行。
也就是说，JavaScript 同时只能执行一个任务，其他任务都必须在后面排队等待。

注意，JavaScript 只在一个线程上运行，不代表 JavaScript 引擎只有一个线程。
事实上，JavaScript 引擎有多个线程，单个脚本只能在一个线程上运行（称为主线程），其他线程都是在后台配合。

为了利用多核 CPU 的计算能力，HTML5 提出 Web Worker 标准，允许 JavaScript 脚本创建多个线程，但是子线程完全受主线程控制，且不得操作 DOM。
所以，这个新标准并没有改变 JavaScript 单线程的本质。

程序里面所有的任务，可以分成两类：同步任务（synchronous）和异步任务（asynchronous）。

同步任务是那些没有被引擎挂起、**在主线程上排队执行的任务**。只有前一个任务执行完毕，才能执行后一个任务。

异步任务是那些被引擎放在一边，不进入主线程、而 **进入任务队列的任务。**
只有引擎认为某个异步任务可以执行了（比如 Ajax 操作从服务器得到了结果），该任务（采用回调函数的形式）才会进入主线程执行。
排在异步任务后面的代码，不用等待异步任务结束会马上运行，也就是说，**异步任务不具有”堵塞“效应。**


JavaScript 运行时，除了一个正在运行的主线程，引擎还提供多个任务队列（task queue），里面是各种需要当前程序处理的异步任务。
首先，主线程会去执行所有的同步任务。
等到同步任务全部执行完，就会去看任务队列里面的异步任务。
如果满足条件，那么异步任务就重新进入主线程开始执行，这时它就变成同步任务了。
等到执行完，下一个异步任务再进入主线程开始执行。
一旦任务队列清空，程序就结束执行。

异步任务的写法通常是回调函数。
一旦异步任务重新进入主线程，就会执行对应的回调函数。
如果一个异步任务没有回调函数，就不会进入任务队列，也就是说，不会重新进入主线程，因为没有用回调函数指定下一步的操作。

JavaScript 引擎怎么知道异步任务有没有结果，能不能进入主线程呢？
答案就是引擎在不停地检查，一遍又一遍，只要同步任务执行完了，引擎就会去检查那些挂起来的异步任务，是不是可以进入主线程了。
这种循环检查的机制，就叫做事件循环（Event Loop）。
维基百科的定义是：“事件循环是一个程序结构，用于等待和发送消息和事件

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



不连续的操作就叫做异步
同步任务总是比异步任务更早执行。

异步任务可以分成两种。

  - 追加在本轮循环的异步任务
  - 追加在次轮循环的异步任务

本轮循环的执行顺序就讲完了。

  同步任务
  process.nextTick()
  微任务
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
为了协调异步任务，Node 居然提供了四个定时器，让任务可以在指定的时间运行。

setTimeout()
setInterval()
setImmediate()
process.nextTick()
前两个是语言的标准，后两个是 Node 独有的。它们的写法差不多，作用也差不多，不太容易区别。

首先，有些人以为，除了主线程，还存在一个单独的事件循环线程。
不是这样的，**只有一个主线程，事件循环是在主线程上完成的。**
### Node
其次，Node 开始执行脚本时，会先进行事件循环的初始化，但是这时事件循环还没有开始，会先完成下面的事情。

  - 同步任务
  - 发出异步请求
  - 规划定时器生效的时间
  - 执行process.nextTick()等等

最后，上面这些事情都干完了，事件循环就正式开始了。

事件循环会无限次地执行，一轮又一轮。
只有异步任务的回调函数队列清空了，才会停止执行。

每一轮的事件循环，分成六个阶段。这些阶段会依次执行。
  - timers
  - I/O callbacks
  - idle handlers
  - prepare handlers
  - I/O poll
  - Check Handlers
  - Close Handlers
每个阶段都有一个先进先出的回调函数队列。
只有一个阶段的回调函数队列清空了，该执行的回调函数都执行了，事件循环才会进入下一个阶段。

1. timers
> 这个是定时器阶段，处理setTimeout()和setInterval()的回调函数。
进入这个阶段后，主线程会检查一下当前时间，是否满足定时器的条件。如果满足就执行回调函数，否则就离开这个阶段。

2. I/O callbacks
> 除了以下操作的回调函数，其他的回调函数都在这个阶段执行。

setTimeout()和setInterval()的回调函数
setImmediate()的回调函数
用于关闭请求的回调函数，比如socket.on('close', ...)

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



这是因为setTimeout的第二个参数默认为0。但是实际上，Node 做不到0毫秒，最少也需要1毫秒，
根据官方文档，第二个参数的取值范围在1毫秒到2147483647毫秒之间。
也就是说，**setTimeout(f, 0)等同于setTimeout(f, 1)。**

实际执行的时候，进入事件循环以后，有可能到了1毫秒，也可能还没到1毫秒，取决于系统当时的状况。
如果没到1毫秒，那么 timers 阶段就会跳过，进入 check 阶段，先执行setImmediate的回调函数。

由于setTimeout在 timers 阶段执行，而setImmediate在 check 阶段执行。所以，setTimeout会早于setImmediate完成。
```js

const fs = require('fs');

fs.readFile('test.js', () => {
  setTimeout(() => console.log(1));
  setImmediate(() => console.log(2));
});
```
上面代码会先进入 I/O callbacks 阶段，然后是 check 阶段，最后才是 timers 阶段。
因此，setImmediate才会早于setTimeout执行。

process.nextTick这个名字有点误导，它是在本轮循环执行的，而且是所有异步任务里面最快执行的。
Node 执行完所有同步任务，接下来就会执行process.nextTick的任务队列。

Node 规定，process.nextTick和Promise的回调函数，追加在本轮循环，即同步任务一旦执行完成，就开始执行它们。
而setTimeout、setInterval、setImmediate的回调函数，追加在次轮循环。

process.nextTick 它指定的任务总是发生在所有异步任务之前。

setImmediate方法则是在当前"任务队列"的尾部添加事件

setImmediate指定的回调函数，总是排在setTimeout前面。

process.nextTick和setImmediate的一个重要区别：
  多个process.nextTick语句总是在当前"执行栈"一次执行完，
  多个setImmediate可能则需要多次loop才能执行完。

由于process.nextTick指定的回调函数是在本次"事件循环"触发，而setImmediate指定的是在下次"事件循环"触发，
所以很显然，前者总是比后者发生得早，而且执行效率也高（因为不用检查"任务队列"）。


**nextTickQueue**
process.nextTick这个名字有点误导，它是在本轮循环执行的，而且是所有异步任务里面最快执行的。
Node 执行完所有同步任务，接下来就会执行process.nextTick的任务队列。

**microTaskQueue**
根据语言规格，Promise对象的回调函数，会进入异步任务里面的"微任务"（microtask）队列。
微任务队列追加在process.nextTick队列的后面，也属于本轮循环。

JSON.stringify(str,Array(keys)) 属性转换白名单
JSON.stringify(str,Function(key,value)) 属性过滤器
JSON.stringify(str,*,Number) 前置空格数
JSON.stringify(str,*,String) 前置字符串


JSON.stringify还可以接受第三个参数，用于增加返回的 JSON 字符串的可读性。
如果是数字，表示每个属性前面添加的空格（最多不超过10个）；
如果是字符串（不超过10个字符），则该字符串会添加在每行前面。
```js
JSON.stringify({ p1: 1, p2: 2 }, null, 2);
/*
"{
  "p1": 1,
  "p2": 2
}"
*/

JSON.stringify({ p1:1, p2:2 }, null, '|-');
/*
"{
|-"p1": 1,
|-"p2": 2
}"
*/
```

JSON.stringify方法还可以接受一个数组，作为第二个参数，指定需要转成字符串的属性。
```js
var obj = {
  'prop1': 'value1',
  'prop2': 'value2',
  'prop3': 'value3'
};

var selectedProperties = ['prop1', 'prop2'];

JSON.stringify(obj, selectedProperties)
// "{"prop1":"value1","prop2":"value2"}"
```


第二个参数还可以是一个函数，用来更改JSON.stringify的返回值。
```js
function f(key, value) {
  if (typeof value === "number") {
    value = 2 * value;
  }
  return value;
}

JSON.stringify({ a: 1, b: 2 }, f)
// '{"a": 2,"b": 4}'
```

Number.prototype.toFixed()
toFixed方法先将一个数转为指定位数的小数，然后返回这个小数对应的字符串。

(10).toFixed(2) // "10.00"
10.005.toFixed(2) // "10.01"
上面代码中，10和10.005转成2位小数，其中10必须放在括号里，否则后面的点会被处理成小数点。

toFixed方法的参数为小数位数，有效范围为0到20，超出这个范围将抛出 RangeError 错误。

Number.prototype.toExponential()
toExponential方法用于将一个数转为科学计数法形式。

(10).toExponential()  // "1e+1"
(10).toExponential(1) // "1.0e+1"
(10).toExponential(2) // "1.00e+1"

(1234).toExponential()  // "1.234e+3"
(1234).toExponential(1) // "1.2e+3"
(1234).toExponential(2) // "1.23e+3"
toExponential方法的参数是小数点后有效数字的位数，范围为0到20，超出这个范围，会抛出一个 RangeError 错误。
