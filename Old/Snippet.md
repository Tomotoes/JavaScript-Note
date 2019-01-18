好的代码就像一首歌

```js
<!-- 斐波那契数列 -->
function* fibonacci(){
  let [prev,curr] = [0,1]
  while(true){
    [prev,curr] = [curr,curr+prev]
    yield curr
  }
}

for(let n of fibonacci()){
  if(n>1000) break
  console.log(n)
}

<!-- 巧用 Proxy 实现函数链式调用 -->
const pipe = (function () {
  return function (value) {
    const funcStack = [];
    const oproxy = new Proxy({} , {
      get : function (pipeObject, fnName) {
        if (fnName === 'get') {
          return funcStack.reduce(function (val, fn) {
            return fn(val);
          },value);
        }
        funcStack.push(window[fnName]);
        return oproxy;
      }
    });

    return oproxy;
  }
}());

const double = n => n * 2;
const pow    = n => n * n;
const reverseInt = n => n.toString().split("").reverse().join("") | 0;

pipe(3).double.pow.reverseInt.get; // 63

<!-- 生成各种 DOM 节点的通用函数dom -->
const dom = new Proxy({},{
  get(target,property){
    return function (attrs={},...children){
      const el = document.createElement(property)
      
      for(let prop of Object.keys(attrs)){
        el.setAttribute(prop,attrs[prop])
      }
      console.log(property) // a li li li ul div
      for(let child of children){
        if(typeof child === 'string'){
          child = document.createTextNode(child)
        }
        el.appendChild(child)
      }

      return el
    }
  }
})

const el = dom.div({},
  'Hello, my name is ',
  dom.a({href: '//example.com'}, 'Mark'),
  '. I like:',
  dom.ul({},
    dom.li({}, 'The web'),
    dom.li({}, 'Food'),
    dom.li({}, '…actually that\'s it')
  )
)

document.body.appendChild(el)

<!-- 并行与串行的结合 -->
const items = [ 1, 2, 3, 4, 5, 6 ];
const results = [];
const limit = 2;
let running = 0;

function async(arg, callback) {
  console.log('参数为 ' + arg +' , 1秒后返回结果');
  setTimeout(function () { callback(arg * 2); }, 1000);
}

function final(value) {
  console.log('完成: ', value);
}

function launcher() {
  while(running < limit && items.length > 0) {
    const item = items.shift();
    async(item, function(result) {
      results.push(result);
      running--;
      if(items.length > 0) {
        launcher();
      } else if(running == 0) {
        final(results);
      }
    });
    running++;
  }
}

launcher();
```
