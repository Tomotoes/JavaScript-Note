1. void + 合法表达式 永远返回 `undefined`

   ```js
   void expression => undefined
   
   // void operator
   void 0                  // returns undefined
   void (0)                // returns undefined
   void 'abc'              // returns undefined
   void {}                 // returns undefined
   void (1 === 1)          // returns undefined
   void (1 !== 1)          // returns undefined
   void anyfunction()      // returns undefined
   ```

   

2. 无参构造函数实例化时 括号无所谓

   ```js
   const val = new construcion
   
   ===
   
   const val = new construction()
   
   // Constructor with brackets
   const date = new Date()
   const month = new Date().getMonth()
   const myInstance = new MyClass()
   
   // Constructor without brackets
   const date = new Date
   const month = (new Date).getMonth()
   const myInstance = new MyClass
   ```



3. with

   ```js
   // with block example
   const person = {
     firstname: 'Nathan',
     lastname: 'Drake',
     age: 29
   }
   
   with (person) {
     console.log(`${firstname} ${lastname} is ${age} years old`)
   }
   // Nathan Drake is 29 years old
   ```

   

4. label

   ```js
   forLoop1: //The first for statement is labeled "forLoop1"
   for (i = 0; i < 3; i++) {      
      forLoop2: //The second for statement is labeled "forLoop2"
      for (j = 0; j < 3; j++) {   
         if (i === 1 && j === 1) {
            continue forLoop1
         }
         console.log('i = ' + i + ', j = ' + j)
      }
   }
   ```

   

5. 函数属性

   > 因为函数也是对象,当然可以挂载属性了

   ```js
   // custom functional properties
   function greet () {
     if (greet.locale === 'fr') {
       console.log('Bonjour!')
     } else if (greet.locale === 'es') {
       console.log('Hola!')
     } else {
       console.log('Hello!')
     }
   }
   
   greet()
   // Hello!
   greet.locale = 'fr'
   greet()
   // Bonjour!
   
   
   // custom functional properties
   function generateNumber () {
     if (!generateNumber.counter) {
       generateNumber.counter = 0
     }
     return ++generateNumber.counter
   }
   
   console.log(generateNumber())
   // 1
   console.log(generateNumber())
   // 2
   console.log('current counter value: ', generateNumber.counter)
   // current counter value: 2
   generateNumber.counter = 10
   console.log('current counter value: ', generateNumber.counter)
   // current counter value: 10
   console.log(generateNumber())
   // 11
   ```

   



6. 可以跳过 IIFE 的括号

   ```js
   // IIFE
   (function () {
     console.log('Normal IIFE called')
   })()
   // Normal IIFE called
   
   void function () {
     console.log('Cool IIFE called')
   }()
   // Cool IIFE called
   
   
   
   // IIFE with a return
   
   result = (function () {
     // ... some code
     return 'Victor Sully'
   })()
   // result: 'Victor Sully'
   
   result = function () {
     // ... some code
     return 'Nathan Drake'
   }()
   // result: 'Nathan Drake'
   ```

   

7. Function 函数的构造函数

   ```js
   // Function constructor
   const multiply = new Function('x', 'y', 'return x*y;');
   multiply(2, 3)
   // 6
   ```

   

8. 参数属性

  - arguments.callee：指当前调用的函数；
  - arguments.callee.caller：指调用当前函数的函数。

  ```js
  // callee && caller
  const myFunction = function () {
    console.log('Current function: ', arguments.callee.name)
    console.log('Invoked by function: ', arguments.callee.caller.name)
  }
  
  void function main () {
    myFunction()
  } ()
  
  // Current function: myFunction
  // Invoked by function: main
  ```

  

9. 标记模板字面量

   ```js
   // Defining a Tag for template literals
   function highlight(strings, ...values) {
     // here i is the iterator for the strings array
     let result = ''
     strings.forEach((str, i) => {
       result += str
       if (values[i]) {
         result += `<mark>${values[i]}</mark>`
       }
     })
     return result
   }
   
   const author = 'Henry Avery'
   const statement = `I am a man of fortune & I must seek my fortune`
   const quote = highlight`${author} once said, ${statement}`
   
   // <mark>Henry Avery</mark> once said, <mark>I am a man of fortune
   // & I must seek my fortune</mark>
   
   ((text, ...value)=>(console.log(text,value)))`${1}abc${2}`
   text => ["", "abc", "", raw: Array(3)]
   			 raw: ["", "abc", ""]
   
   value => [1, 2]
   ```

   

10. Getter & Setter

  ```js
  // Getters & Setters
  const user = {
    firstName: 'Nathan',
    lastName: 'Drake',
  
    // fullname is a virtual field
    get fullName() {
      return this.firstName + ' ' + this.lastName
    },
  
    // validate age before saving
    set age(value) {
      if (isNaN(value)) throw Error('Age has to be a number')
      this._age = Number(value)
    },
    get age() {
      return this._age
    }
  }
  
  console.log(user.fullName) // Nathan Drake 
  user.firstName = 'Francis'
  console.log(user.fullName) // Francis Drake
  user.age = '29'
  console.log(user.age) // 29
  // user.age = 'invalid text' // Error: Age has to be a number
  ```

  - 访问 `Getter` 像属性那样去访问

  - `Setter` 拦截设置

    

11. 逗号表达式

    > 返回最后一个表达式

    ```js
    const getSquare = x => (console.log (x), x * x)
    ```

    

12. 加号表达式

    > 快速将表达式转换为数字

    ```js
    // Plus operator
    +'9.11'          // returns 9.11
    +'-4'            // returns -4
    +'0xFF'          // returns 255
    +true            // returns 1
    +'123e-5'        // returns 0.00123
    +false           // returns 0
    +null            // returns 0
    +'Infinity'      // returns Infinity
    +'1,234'         // returns NaN
    +dateObject      // returns 1542975502981 (timestamp)
    +momentObject    // returns 1542975502981 (timestamp)
    
    ```

    

13. !!运算符

    > 快速将表达式转换为布尔值

    ```js
    // Bang Bang operator
    
    !!null            // returns false
    !!undefined       // returns false
    !!false           // returns false
    !!true            // returns true
    !!""              // returns false
    !!"string"        // returns true
    !!0               // returns false
    !!1               // returns true
    !!{}              // returns true
    !![]              // returns true
    ```

    

14. ~运算符

    > ~num => -( num + 1 )

    ```js
    const val = 10
    ~10 => -11
    
    // Tilde operator with indexOf
    let username = "Nathan Drake"
    
    if (~username.indexOf("Drake")) {
      console.log('Access denied')
    } else {
      console.log('Access granted')
    }
    ```

    

15. 标签块级作用域

    ```js
    loopBlock4: {
      console.log('I will print')
      break loopBlock4
      console.log('I will not print')
    }
    
    declarationBlock: {
      // can be used to group logical code blocks together
      var i, j
    }
    ```

16. ~~运算符

    > 对整数进行向下取整

    ```js
    ~~1.9 === 1
    ```

17. 在 Chrome 中修改 `navigator.language`

    1. 打开 `chrome://settings/languages`
    2. 将目标语言移动到顶部 , 即可修改

    

18. 使用 Chrome 调试 JS代码

    ```js
    function test(){
    	//do something...
    }
    
    debug(test())
    ```

    









