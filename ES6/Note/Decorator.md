1. 类的修饰
修饰器函数的第一个参数，就是所要修饰的目标类。
如果觉得一个参数不够用，可以在修饰器外面再封装一层函数。

修饰器对类的行为的改变，是代码编译时发生的，而不是在运行时。
这意味着，修饰器能在编译阶段运行代码。也就是说，修饰器本质就是编译时执行的函数。
```js
// mixins.js
export function mixins(...list) {
  return function (target) {
    Object.assign(target.prototype, ...list)
  }
}

// main.js
import { mixins } from './mixins'

const Foo = {
  foo() { console.log('foo') }
};

@mixins(Foo)
class MyClass {}

let obj = new MyClass();
obj.foo() // 'foo'
```

2. 方法的修饰
修饰器函数一共可以接受三个参数
- target,类的原型对象
- name,所要修饰的属性名
- descriptor 该属性的描述对象
**需要返回 该属性的描述对象，也就是第三个参数**

如果同一个方法有多个修饰器，会像剥洋葱一样，先从外到内进入，然后由内向外执行。

从长期来看，它将是 JavaScript 代码静态分析的重要工具。
```js
class Math{
  @log
  add(a,b){
    return a+b
  }
}
function log(target,name,descriptor){
  const oldValue = descriptor.value
  descriptor.value = function(){
    console.log(`Calling ${name} with`, arguments)
    return oldValue.apply(this,arguments)
  }
  return descriptor
}
const math = new Math();

// passed parameters should get logged now
math.add(2, 4);
```
3. 函数的遗憾
修饰器只能用于类和类的方法，不能用于函数，因为 **存在函数提升**
如果一定要修饰函数，可以采用高阶函数的形式直接执行。
```js
function doSomething(name) {
  console.log('Hello, ' + name);
}

function loggingDecorator(wrapped) {
  return function() {
    console.log('Starting');
    const result = wrapped.apply(this, arguments);
    console.log('Finished');
    return result;
  }
}

const wrapped = loggingDecorator(doSomething);
```