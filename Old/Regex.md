# 正则表达式

  正则表达式（regular expression）是一种表达文本模式（即字符串结构）的方法，有点像字符串的模板，常常用来按照“给定模式”匹配文本。



## 实例

```js
/匹配模板/修饰符
const regex = /hello/i

new RegExp('匹配模板','修饰符')
const regex = new RegExp('hello','i')

new RegExp(/匹配模板/修饰符)
const regex = new RegExp(/hello/i)

> ES6
new RegExp(/匹配模板/原有修饰符,修饰符)
const regex = new RegExp(/hello/img,i).flags // i
如果RegExp构造函数第一个参数是一个正则对象，那么可以使用第二个参数指定修饰符。
而且，返回的正则表达式会忽略原有的正则表达式的修饰符，只使用新指定的修饰符。
```

匹配模板如果为空，匹配所有字符串

### 修饰符 [syimgu]

修饰符（modifier）表示模式的附加规则，放在正则模式的最尾部。
修饰符可以单个使用，也可以多个一起使用。

1. i：ignoreCase

   > 忽略大小写

   regex.ignoreCase

2. g：global

  > 全局搜索，即适用于 会有多个结果。
  
  默认情况下，第一次匹配成功后，正则对象就停止向下匹配了。

  g修饰符表示全局匹配，加上它以后，正则对象将匹配全部符合条件的结果，主要用于搜索和替换。

  每一次开始搜索的位置都是上一次匹配的后一个位置。

  regex.global
  regex.lastIndex 

3. m：multiline

> 多行匹配

m修饰符表示多行模式，会修改^和$的行为。
默认情况下（即不加m修饰符时），^和$匹配字符串的开始处和结尾处，
加上m修饰符以后，^和$还会匹配行首和行尾，即^和$会识别换行符（\n）。

```js
/world$/.test('hello world\n') // false
/world$/m.test('hello world\n') // true

/^b/m.test('a\nb') // true
上面代码要求匹配行首的b，如果不加m修饰符，就相当于b只能处在字符串的开始处。加上b修饰符以后，换行符\n也会被认为是一行的开始。
```

regex.multiline

#### ES6

4. u：Unicode

> 含义为“Unicode 模式”，用来正确处理大于\uFFFF的 Unicode 字符。也就是说，会正确处理四个字节的 UTF-16 编码。

```js
/^\uD83D/u.test('\uD83D\uDC2A') // false
/^\uD83D/.test('\uD83D\uDC2A') // true
```

上面代码中，\uD83D\uDC2A是一个四个字节的 UTF-16 编码，代表一个字符。
但是，ES5 不支持四个字节的 UTF-16 编码，会将其识别为两个字符，导致第二行代码结果为true。
加了u修饰符以后，ES6 就会识别其为一个字符，所以第一行代码结果为false。

*一旦加上u修饰符号，就会修改下面这些正则表达式的行为。*

  - 点字符

  点（.）字符在正则表达式中，含义是除了换行符以外的任意单个字符。对于码点大于0xFFFF的 Unicode 字符，点字符不能识别，必须加上u修饰符。

  - Unicode 字符表示法

  ES6 新增了使用大括号表示 Unicode 字符，这种表示法在正则表达式中必须加上u修饰符，才能识别当中的大括号，否则会被解读为量词。

  - 量词

  使用u修饰符后，所有量词都会正确识别码点大于0xFFFF的 Unicode 字符。

  - 预定义模式

  u修饰符也影响到预定义模式，能否正确识别码点大于0xFFFF的 Unicode 字符。

  - i 修饰符

  有些 Unicode 字符的编码不同，但是字型很相近，比如，\u004B与\u212A都是大写的K。

------

5. y：sticky

> “粘连”（sticky）修饰符。

y修饰符的作用与g修饰符类似，也是全局匹配，后一次匹配都从上一次匹配成功的下一个位置开始。

不同之处在于，g修饰符只要剩余位置中存在匹配就可，而 **y修饰符确保匹配必须从剩余的第一个位置开始**，这也就是“粘连”的涵义。

regex.sticky

```js
var s = 'aaa_aa_a';
var r1 = /a+/g;
var r2 = /a+/y;

r1.exec(s) // ["aaa"]
r2.exec(s) // ["aaa"]

r1.exec(s) // ["aa"]
r2.exec(s) // null

由于g修饰没有位置要求，所以第二次执行会返回结果，而y修饰符要求匹配必须从头部开始，所以返回null。

var s = 'aaa_aa_a';
var r = /a+_/y;

r.exec(s) // ["aaa_"]
r.exec(s) // ["aa_"]
上面代码每次匹配，都是从剩余字符串的头部开始。
```

**y修饰符同样遵守lastIndex属性，但是要求必须在lastIndex指定的位置发现匹配。**

```js
const REGEX = /a/y;

// 指定从2号位置开始匹配
REGEX.lastIndex = 2;

// 不是粘连，匹配失败
REGEX.exec('xaya') // null

// 指定从3号位置开始匹配
REGEX.lastIndex = 3;

// 3号位置是粘连，匹配成功
const match = REGEX.exec('xaya');
match.index // 3
REGEX.lastIndex // 4
```

**实际上，y修饰符号隐含了头部匹配的标志^。**
y修饰符的设计本意，就是让头部匹配的标志^在全局匹配中都有效。

```js
const REGEX = /a/gy;
'aaxa'.replace(REGEX, '-') // '--xa'
```

上面代码中，最后一个a因为不是出现在下一次匹配的头部，所以不会被替换。

**单单一个y修饰符对match方法，只能返回第一个匹配，必须与g修饰符联用，才能返回所有匹配。**

```js
'a1a2a3'.match(/a\d/y) // ["a1"]
'a1a2a3'.match(/a\d/gy) // ["a1", "a2", "a3"]
```

如果字符串里面没有非法字符，y修饰符与g修饰符的提取结果是一样的。
但是，一旦出现非法字符，两者的行为就不一样了。
g修饰符会忽略非法字符，而y修饰符不会，这样就很容易发现错误。

------

6. s：dotAll

正则表达式中，点（.）是一个特殊字符，代表任意的单个字符，但是有两个例外。
一个是四个字节的 UTF-16 字符，这个可以用u修饰符解决；
另一个是行终止符（line terminator character）。

所谓行终止符，就是该字符表示一行的终结。以下四个字符属于”行终止符“。

  U+000A 换行符（\n）
  U+000D 回车符（\r）
  U+2028 行分隔符（line separator）
  U+2029 段分隔符（paragraph separator）

```js
/foo.bar/.test('foo\nbar')
// false
上面代码中，因为.不匹配\n，所以正则表达式返回false。

但是，很多时候我们希望匹配的是任意单个字符，这时有一种变通的写法。

/foo[^]bar/.test('foo\nbar')
// true

这种解决方案毕竟不太符合直觉，ES2018 引入s修饰符，使得.可以匹配任意单个字符。

/foo.bar/s.test('foo\nbar') // true
```

这被称为dotAll模式，即点（dot）代表一切字符。
/s修饰符和多行修饰符/m不冲突，两者一起使用的情况下，.匹配所有字符，而^和$匹配每一行的行首和行尾。

## 属性

正则对象的实例属性分成两类。
并且 属性除了 `lastIndex` 其余全部只读。

一类是修饰符相关，返回一个布尔值，表示对应的修饰符是否设置。

### 修饰符相关

RegExp.prototype.ignoreCase：返回一个布尔值，表示是否设置了i修饰符。
RegExp.prototype.global：返回一个布尔值，表示是否设置了g修饰符。
RegExp.prototype.multiline：返回一个布尔值，表示是否设置了m修饰符。

> ES6
> RegExp.prototype.sticky：返回一个布尔值，表示是否设置了y修饰符。
> RegExp.prototype.dotAll：返回一个布尔值，表示是否设置了s修饰符。
> RegExp.prototype.unicode：返回一个布尔值，表示是否设置了s修饰符。

RegExp.prototype.flags：返回一个字符串，代表正则表达式的修饰符。

```js
const regex = /hello/syimg 手淫图片
regex.ignoreCase
regex.global
regex.multiline
regex.sticky 
regex.dotAll
regex.unicode
regex.flags // 'gimys'
```

### 修饰符无关

1. RegExp.prototype.lastIndex

  > 返回一个数值，表示下一次开始搜索的位置。该属性可读写。

  lastIndex属性只对同一个正则表达式有效，所以下面这样写是错误的。

  ```js
  var count = 0;
  while (/a/g.test('babaa')) count++;
  ```

  上面代码会导致无限循环，因为while循环的每次匹配条件都是一个新的正则表达式，导致lastIndex属性总是等于0。

1. RegExp.prototype.source

> 返回正则表达式的字符串形式（不包括反斜杠）。

```js
const regex = /hello/igm
regex.lastIndex >> 0
regex.source >> "hello"
```

## 方法

1. RegExp.prototype.test(str)

  > 正则实例对象的test方法返回一个布尔值，表示当前模式是否能匹配参数字符串。

  ```js
  /hello/i.test('Hello World') //true

  var r = /x/g;
  var s = '_x_x';

  r.lastIndex // 0
  r.test(s) // true

  r.lastIndex // 2
  r.test(s) // true

  r.lastIndex // 4
  r.test(s) // false
  ```

1. RegExp.prototype.exec(str)

  > 用来返回匹配结果。如果发现匹配，就返回一个数组，成员是匹配成功的子字符串，否则返回null。
  > 返回数组还包含以下两个属性：
  > input：整个原字符串。
  > index：整个模式匹配成功的开始位置（从0开始计数）。

  ```js
  /(hello)/g.exec('hello world hello asd hello')
  >  ["hello", "hello", index: 0, input: "hello world hello asd hello", groups: undefined]
  ```

  如果正则表示式包含圆括号（即含有“组匹配”），则返回的数组会包括多个成员。
  第一个成员是整个匹配成功的结果，后面的成员就是圆括号对应的匹配成功的组。
  也就是说，第二个成员对应第一个括号，第三个成员对应第二个括号，以此类推。
  整个数组的length属性等于组匹配的数量再加1。

  如果正则表达式加上g修饰符，则可以使用多次exec方法，

  下一次搜索的位置从上一次匹配成功结束的位置开始。

  毋庸置疑，最后一次匹配一定为 null，lastIndex 属性为0，

  **这意味下一次的匹配将从头开始** 一定要及时退出

  ```js
  var reg = /a/g;
  var str = 'abc_abc_abc'
  
  while(true) {
    var match = reg.exec(str);
    if (!match) break;
    console.log('#' + match.index + ':' + match[0]);
  }
  // #0:a
  // #4:a
  // #8:a
  ```

  正则实例对象的lastIndex属性不仅可读，还**可写**。
  设置了 g 修饰符的时候，只要手动设置了lastIndex的值，就会从指定位置开始匹配。

### 字符串的实例方法

ES6 将这 4 个方法，在语言内部全部调用RegExp的实例方法，从而做到所有与正则相关的方法，全都定义在RegExp对象上。

String.prototype.match 调用 RegExp.prototype[Symbol.match]
String.prototype.replace 调用 RegExp.prototype[Symbol.replace]
String.prototype.search 调用 RegExp.prototype[Symbol.search]
String.prototype.split 调用 RegExp.prototype[Symbol.split]

1. String.prototype.match()

  > 返回一个数组，成员是所有匹配的子字符串。
  > 字符串的match方法与正则对象的exec方法非常类似：匹配成功返回一个数组，匹配失败返回null。

2. 如果正则表达式带有g修饰符，则该方法与正则对象的exec方法行为不同，会返回所有匹配成功的结果。

3. 设置正则表达式的lastIndex属性，对match方法无效，匹配总是从字符串的第一个字符开始。

   ```js
   "asdasd".match("sd")
   ["sd", index: 1, input: "asdasd", groups: undefined]
   "asdasd".match(/sd/g)
   (2) ["sd", "sd"]
   ```

4. String.prototype.search()

   > 按照给定的正则表达式进行搜索，返回一个整数，表示匹配开始的位置。
   > 返回第一个满足条件的匹配结果在整个字符串中的位置。如果没有任何匹配，则返回-1。

   ```js
   "asdasd".search(/sd/) 1
   "asdasd".search("sd") 1
   ```

5. String.prototype.replace()

> 按照给定的正则表达式进行替换，返回替换后的字符串。

替换匹配的值。它接受两个参数，第一个是正则表达式，表示搜索模式，第二个是替换的内容。
正则表达式如果不加g修饰符，就替换第一个匹配成功的值，否则替换所有匹配成功的值。

```js
"asdasd".replace(/asd/g,"ww")
"wwww"
```

下面 着重讲一下 replace方法的第二个参数

#### 美元符号

> 可以使用美元符号$，用来指代所替换的内容。

- $&

  > 匹配的子字符串。

- $`

  > 匹配结果前面的文本。

- $’

  > 匹配结果后面的文本。

- $n

  > 匹配成功的第n组内容，n是从1开始的自然数。

- $$

  > 指代美元符号$。

> 主要用于 更新字符串，修修补补啊~

```js
'hello world'.replace(/(\w+)\s(\w+)/, '$2 $1')
// "world hello"

'abc'.replace('b', '[$`-$&-$\']')
// "a[a-b-c]c"
```

------

#### 函数

> 将每一个匹配内容替换为函数返回值。返回的值 将替换掉匹配的字符串

可以接受多个参数。

其中，第一个参数是捕捉到的内容，
第二个参数是捕捉到的组匹配（有多少个组匹配，就有多少个对应的参数）。
此外，最后还可以添加两个参数，倒数第二个参数是捕捉到的内容在整个字符串中的位置（比如从第五个位置）

最后一个参数是原字符串。

```js
'3 and 5'.replace(/[0-9]+/g,match=>match*2)
> "6 and 10"

var a = 'The quick brown fox jumped over the lazy dog.';
var pattern = /quick|brown|lazy/ig;

a.replace(pattern, function replacer(match) {
  return match.toUpperCase();
});
// The QUICK BROWN fox jumped over the LAZY dog.

var prices = {
  'p1': '$1.99',
  'p2': '$9.99',
  'p3': '$5.00'
};

var template = '<span id="p1"></span>'
  + '<span id="p2"></span>'
  + '<span id="p3"></span>';

template.replace(
  /(<span id=")(.*?)(">)(<\/span>)/g,
  function(match, $1, $2, $3, $4){
    return $1 + $2 + $3 + prices[$2] + $4;
  }
);
// "<span id="p1">$1.99</span><span id="p2">$9.99</span><span id="p3">$5.00</span>"
上面代码的捕捉模式中，有四个括号，所以会产生四个组匹配，在匹配函数中用$1到$4表示。匹配函数的作用是将价格插入模板中。
```

主要用于 对匹配的特定参数做一些小手术~

------

String.prototype.split()

> 按照正则规则分割字符串，返回一个由分割后的各个部分组成的数组。

该方法接受两个参数，第一个参数是正则表达式，表示分隔规则，
**第二个参数是返回数组的最大成员数。**

```js
// 非正则分隔
'a,  b,c, d'.split(',')
// [ 'a', '  b', 'c', ' d' ]

// 正则分隔，去除多余的空格
'a,  b,c, d'.split(/, */)
// [ 'a', 'b', 'c', 'd' ]

// 指定返回数组的最大成员
'a,  b,c, d'.split(/, */, 2)
[ 'a', 'b' ]
```

### 正则规则

1. 字面量字符和元字符

   > 大部分字符在正则表达式中，就是字面的含义，比如/a/匹配a，/b/匹配b。

   `/dog/.test('old dog') // true`
   上面代码中正则表达式的dog，就是字面量字符，所以/dog/匹配old dog，因为它就表示d、o、g三个字母连在一起。

2. 元字符

   1. 点字符

      > `. 点字符（.）` 匹配除回车（\r）、换行(\n) 、行分隔符（\u2028）和段分隔符（\u2029）以外的所有字符。

      如果想匹配 回车（\r）、换行(\n) 、行分隔符（\u2028）和段分隔符（\u2029）请使用 `s` 修饰符
      匹配 Unicode字符， 使用 `u` 修饰符

      ```js
      /c.t/
      上面代码中，c.t匹配c和t之间包含任意一个字符的情况，只要这三个字符在同一行，
      比如cat、c2t、c-t等等，但是不匹配coot。
      ```

   2. 位置字符

      > ^ 表示字符串的开始位置
      > $ 表示字符串的结束位置

      ```js
      // test必须出现在开始位置
      /^test/.test('test123') // true
      
      // test必须出现在结束位置
      /test$/.test('new test') // true
      
      // 从开始位置到结束位置只有test
      /^test$/.test('test') // true
      /^test$/.test('test test') // false
      ```

   3. 选择符（|）

   > 竖线符号（|）在正则表达式中表示“或关系”（OR），即cat|dog表示匹配cat或dog。
   > `/11|22/.test('911') // true`
   > 多个选择符可以联合使用。

   其他的元字符还包括\\、\*、+、?、()、[]、{}等，将在下文解释。

3. 转义符
   正则表达式中那些有特殊含义的元字符，如果要匹配它们本身，就需要在它们前面要加上反斜杠。比如要匹配+，就要写成\+。
   需要特别注意的是，如果使用RegExp方法生成正则对象，转义需要使用两个斜杠，因为字符串内部会先转义一次。

   ```
   /1+1/.test('1+1')
   // false
   
   /1\+1/.test('1+1')
   // true
   
   (new RegExp('1\+1')).test('1+1')
   // false
   
   (new RegExp('1\\+1')).test('1+1')
   // true
   ```

   

4. 特殊字符
   \cX 表示Ctrl-[X]，其中的X是A-Z之中任一个英文字母，用来匹配控制字符。
   [\b] 匹配退格键(U+0008)，不要与\b混淆。
   \n 匹配换行键。
   \r 匹配回车键。
   \t 匹配制表符 tab（U+0009）。
   \v 匹配垂直制表符（U+000B）。
   \f 匹配换页符（U+000C）。
   \0 匹配null字符（U+0000）。
   \xhh 匹配一个以两位十六进制数（\x00-\xFF）表示的字符。
   \uhhhh 匹配一个以四位十六进制数（\u0000-\uFFFF）表示的 Unicode 字符。

5. 字符类
   字符类（class）表示有一系列字符可供选择，只要匹配其中一个就可以了。
   所有可供选择的字符都放在方括号内，比如[xyz] 表示x、y、z之中任选一个匹配。

   ```js
   /[abc]/.test('hello world') // false
   /[abc]/.test('apple') // true
   ```

    有两个字符在字符类中有特殊含义。

6. 脱字符（^）
   注意，脱字符只有在字符类的第一个位置才有特殊含义，否则就是字面含义。
   如果方括号内的第一个字符是[^]，则表示除了字符类之中的字符，其他字符都可以匹配。
   比如，[^xyz]表示除了x、y、z之外都可以匹配。
   如果方括号内没有其他字符，即只有[^]，就表示匹配一切字符，其中包括换行符。

   ```js
     var s = 'Please yes\nmake my day!';
   
     s.match(/yes.*day/) // null
     s.match(/yes[^]*day/) // [ 'yes\nmake my day']
   ```

   

7. 连字符（-）
   某些情况下，对于连续序列的字符，连字符（-）用来提供简写形式，表示字符的连续范围。
   比如，[abc]可以写成[a-c]，[0123456789]可以写成[0-9]，同理[A-Z]表示26个大写字母。
   当连字号（dash）不出现在方括号之中，就不具备简写的作用，只代表字面的含义

   ```js
     [0-9.,]
     [0-9a-fA-F]
     [a-zA-Z0-9-]
     [1-31]
     [\u0128-\uFFFF]
     上面代码中最后一个字符类[1-31]，不代表1到31，只代表1到3。
   ```

     另外，不要过分使用连字符，设定一个很大的范围，否则很可能选中意料之外的字符。
     最典型的例子就是[A-z]，表面上它是选中从大写的A到小写的z之间52个字母，
     但是由于在 ASCII 编码之中，大写字母与小写字母之间还有其他字符，结果就会出现意料之外的结果。

     `/[A-z]/.test('\\') // true`
     上面代码中，由于反斜杠（’\‘）的ASCII码在大写字母与小写字母之间，结果会被选中。

8. 预定义模式

  某些常见模式的简写方式。

  > \d 

  匹配0-9之间的任一数字，相当于[0-9]。

  > \D 

  匹配所有0-9以外的字符，相当于[^0-9]。

  > \w 

  匹配任意的字母、数字和下划线，相当于[A-Za-z0-9_]。

  > \W 

  除所有字母、数字和下划线以外的字符，相当于[^A-Za-z0-9_]。

  > \s 

  匹配空格（包括换行符、制表符、空格符等），相等于[ \t\r\n\v\f]。

  > \S 

  匹配非空格的字符，相当于[^ \t\r\n\v\f]。

  > \b 

  匹配词的边界。

  > \B 

  匹配非词边界，即在词的内部。

  > [\S\s]指代一切字符。

9. 重复类

   模式的精确匹配次数，使用大括号（{}）表示。
   {n}表示恰好重复n次，
   {n,}表示至少重复n次，
   {n,m}表示重复不少于n次，不多于m次。

   ```js
   /lo{2}k/.test('look') // true
   /lo{2,5}k/.test('looook') // true
   ```

   

10. 量词符
   用来设定某个模式出现的次数。
   ? 问号表示某个模式出现0次或1次，等同于{0, 1}。

- 星号表示某个模式出现0次或多次，等同于{0,}。

- 加号表示某个模式出现1次或多次，等同于{1,}。
  默认情况下都是最大可能匹配，即匹配直到下一个字符不满足匹配规则为止。
  **这被称为贪婪模式。**

```js
// t 出现0次或1次
/t?est/.test('test') // true
/t?est/.test('est') // true

// t 出现1次或多次
/t+est/.test('test') // true
/t+est/.test('ttest') // true
/t+est/.test('est') // false

// t 出现0次或多次
/t*est/.test('test') // true
/t*est/.test('ttest') // true
/t*est/.test('tttest') // true
/t*est/.test('est') // true

var s = 'aaa';
s.match(/a+/) // ["aaa"]
上面代码中，模式是/a+/，表示匹配1个a或多个a，那么到底会匹配几个a呢？
因为默认是贪婪模式，会一直匹配到字符a不出现为止，所以匹配结果是3个a。
```

如果想将贪婪模式改为非贪婪模式，可以在量词符后面加一个问号。
一旦条件满足，就不再往下匹配。

```js
var s = 'aaa';
s.match(/a+?/) // ["a"]
```

*?：表示某个模式出现0次或多次，匹配时采用非贪婪模式。
+?：表示某个模式出现1次或多次，匹配时采用非贪婪模式。

通过在量词后面加个问号就能实现惰性匹配，因此所有惰性匹配情形如下：

```js
{m,n}? 
{m,}?
??
+?
*?
```

0. 组匹配

   正则表达式的括号表示分组匹配，括号中的模式可以用来匹配分组的内容。

   ```js
   /fred+/.test('fredd') // true
   /(fred)+/.test('fredfred') // true
   上面代码中，第一个模式没有括号，结果+只表示重复字母d，第二个模式有括号，结果+就表示匹配fred这个词。
   ```



1. \n引用括号匹配的内容

**重点**
正则表达式内部，还可以用\n引用括号匹配的内容，n是从1开始的自然数，表示对应顺序的括号。

```js
/(.)b(.)\1b\2/.test("abcabc")
// true
\1表示第一个括号匹配的内容（即a），\2表示第二个括号匹配的内容（即c）
```
2. 非捕获组

> (?:x)称为非捕获组（Non-capturing group），表示不返回该组匹配的内容，即匹配的结果中不计入这个括号。

非捕获组的作用请考虑这样一个场景，假定需要匹配foo或者foofoo，

正则表达式就应该写成/(foo){1, 2}/，但是这样会占用一个组匹配。

 这时，就可以使用非捕获组，将正则表达式改为/(?:foo){1, 2}/，它的作用与前一个正则是一样的，但是不会单独输出括号内部的内容。

```js
  请看下面的例子。

  var m = 'abc'.match(/(?:.)b(.)/);
  m // ["abc", "c"]

  // 正常匹配
  var url = /(http|ftp):\/\/([^/\r\n]+)(\/[^\r\n]*)?/;

  url.exec('http://google.com/');
  // ["http://google.com/", "http", "google.com", "/"]

  // 非捕获组匹配
  var url = /(?:http|ftp):\/\/([^/\r\n]+)(\/[^\r\n]*)?/;

  url.exec('http://google.com/');
  // ["http://google.com/", "google.com", "/"]
  上面的代码中，前一个正则表达式是正常匹配，第一个括号返回网络协议；后一个正则表达式是非捕获匹配，返回结果中不包括网络协议。
```

3. 先行断言

x(?=y)称为先行断言（Positive look-ahead），x只有在y前面才匹配，y不会被计入返回结果。
比如，要匹配后面跟着百分号的数字，可以写成/\d+(?=%)/。

“先行断言”中，括号里的部分是不会返回的。

```js
var m = 'abc'.match(/b(?=c)/);
m // ["b"]
上面的代码使用了先行断言，b在c前面所以被匹配，但是括号对应的c不会被返回。
```

4. 先行否定断言

x(?!y)称为先行否定断言（Negative look-ahead），x只有不在y前面才匹配，y不会被计入返回结果。
比如，要匹配后面跟的不是百分号的数字，就要写成/\d+(?!%)/。

  ```js
  /\d+(?!\.)/.exec('3.14')
  // ["14"]
  上面代码中，正则表达式指定，只有不在小数点前面的数字才会被匹配，因此返回的结果就是14。

  “先行否定断言”中，括号里的部分是不会返回的。

  var m = 'abd'.match(/b(?!c)/);
  m // ['b']
  ```

> ES6

5. 后行断言

x只有在y后面才匹配，必须写成`/(?<=y)x/`
比如，只匹配美元符号之后的数字，要写成/(?<=\$)\d+/

“后行断言”的括号之中的部分（(?<=\$)），也是不计入返回结果。

6. 后行否定断言

x只有不在y后面才匹配，必须写成/(?<!y)x/。
比如，只匹配不在美元符号后面的数字，要写成/(?<!\$)\d+/。

```js
/(?<=\$)\d+/.exec('Benjamin Franklin is on the $100 bill')  // ["100"]
/(?<!\$)\d+/.exec('it’s is worth about €90')                // ["90"]
```

7. Unicode 属性类

ES2018 引入了一种新的类的写法\p{...}和\P{...}，允许正则表达式匹配符合 Unicode 某种属性的所有字符。
\P{…}是\p{…}的反向匹配，即匹配不满足条件的字符。
注意，这两种类只对 Unicode 有效，所以使用的时候一定要加上u修饰符。
如果不加u修饰符，正则表达式使用\p和\P会报错，ECMAScript 预留了这两个类。

Unicode 属性类要指定属性名和属性值。
对于某些属性，可以只写属性名，或者只写属性值。

```js
const regexGreekSymbol = /\p{Script=Greek}/u;
regexGreekSymbol.test('π') // true
```

由于 Unicode 的各种属性非常多，所以这种新的类的表达能力非常强。

```js
const regex = /^\p{Decimal_Number}+$/u;
regex.test('𝟏𝟐𝟑𝟜𝟝𝟞𝟩𝟪𝟫𝟬𝟭𝟮𝟯𝟺𝟻𝟼') // true

\p{Number}甚至能匹配罗马数字。

// 匹配所有数字
const regex = /^\p{Number}+$/u;
regex.test('²³¹¼½¾') // true
regex.test('㉛㉜㉝') // true
regex.test('ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫ') // true
下面是其他一些例子。

// 匹配所有空格
\p{White_Space}

// 匹配各种文字的所有字母，等同于 Unicode 版的 \w
[\p{Alphabetic}\p{Mark}\p{Decimal_Number}\p{Connector_Punctuation}\p{Join_Control}]

// 匹配各种文字的所有非字母的字符，等同于 Unicode 版的 \W
[^\p{Alphabetic}\p{Mark}\p{Decimal_Number}\p{Connector_Punctuation}\p{Join_Control}]

// 匹配 Emoji
/\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu

// 匹配所有的箭头字符
const regexArrows = /^\p{Block=Arrows}+$/u;
regexArrows.test('←↑→↓↔↕↖↗↘↙⇏⇐⇑⇒⇓⇔⇕⇖⇗⇘⇙⇧⇩') // true
```

8. 具名组匹配

允许为每一个组匹配指定一个名字，既便于阅读代码，又便于引用。

```js
const RE_DATE = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;

const matchObj = RE_DATE.exec('1999-12-31');
const year = matchObj.groups.year; // 1999
const month = matchObj.groups.month; // 12
const day = matchObj.groups.day; // 31
```

上面代码中，“具名组匹配”在圆括号内部，模式的头部添加“问号 + 尖括号 + 组名”（**?<year>**），然后就可以在exec方法返回结果的groups属性上引用该组名。同时，数字序号（matchObj[1]）依然有效。
如果具名组没有匹配，那么对应的groups对象属性会是undefined。

**解构**
有了具名组匹配以后，可以使用解构赋值直接从匹配结果上为变量赋值。

```js
let {groups: {one, two}} = /^(?<one>.*):(?<two>.*)$/u.exec('foo:bar');
one  // foo
two  // bar
字符串替换时，使用$<组名>引用具名组。

let re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/u;

'2015-01-02'.replace(re, '$<day>/$<month>/$<year>')
// '02/01/2015'
上面代码中，replace方法的第二个参数是一个字符串，而不是正则表达式。

replace方法的第二个参数也可以是函数，该函数的参数序列如下。

'2015-01-02'.replace(re, (
   matched, // 整个匹配结果 2015-01-02
   capture1, // 第一个组匹配 2015
   capture2, // 第二个组匹配 01
   capture3, // 第三个组匹配 02
   position, // 匹配开始的位置 0
   S, // 原字符串 2015-01-02
   groups // 具名组构成的一个对象 {year, month, day}
 ) => {
 let {day, month, year} = args[args.length - 1];
 return `${day}/${month}/${year}`;
});
具名组匹配在原来的基础上，新增了最后一个函数参数：具名组构成的一个对象。函数内部可以直接对这个对象进行解构赋值。
```

引用
如果要在正则表达式内部引用某个“具名组匹配”，可以使用`\k<组名>`的写法。

```js
const RE_TWICE = /^(?<word>[a-z]+)!\k<word>$/;
RE_TWICE.test('abc!abc') // true
RE_TWICE.test('abc!ab') // false
数字引用（\1）依然有效。

const RE_TWICE = /^(?<word>[a-z]+)!\1$/;
RE_TWICE.test('abc!abc') // true
RE_TWICE.test('abc!ab') // false
这两种引用语法还可以同时使用。

const RE_TWICE = /^(?<word>[a-z]+)!\k<word>!\1$/;
RE_TWICE.test('abc!abc!abc') // true
RE_TWICE.test('abc!abc!ab') // false
```



### 匹配

1. 横向模糊匹配

   > 横向模糊指的是，一个正则可匹配的字符串的长度不是固定的，可以是多种情况的。

   其实现的方式是使用量词。

   ```js
   const regex = /ab{2,5}/g
   "abc abbc abbbc".match(regex)
   ```

2. 纵向模糊匹配

   > 一个正则匹配的字符串，具体到某一位字符时，它可以不是某个确定的字符，可以有多种可能。 

   实现的方式是使用字符组。

   ```js
   const regex = /a[123]b/g
   "a0b a1b a2b a3b".match(regex)
   ```

   

### 实战

1. 匹配16进制

   ```
   var regex = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/g;
   var string = "#ffbbad #Fc01DF #FFF #ffE";
   console.log( string.match(regex) ); // ["#ffbbad", "#Fc01DF", "#FFF", "#ffE"]
   ```

   

2. 匹配24小时

   ```
   var regex = /^([01][0-9]|[2][0-3]):[0-5][0-9]$/;
   console.log( regex.test("23:59") ); // true
   console.log( regex.test("02:07") ); // true
   ```

   

3. 匹配 yyyy-mm-dd 格式

   - 年，四位数字即可 

     > [0-9]{4}

   - 月，共12个月，分两种情况 01...09 和 10 -12

     > (0[1-9]|1[0-2])

   - 日，最大31天

     `(0[1-9]|[12][0-9]|3[0-1])`

   ```
   var regex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
   console.log( regex.test("2017-06-10") ); // true
   ```

4. 字符串的开头和结尾添加 `#` 

   ```js
   "I\nlove\njavascript".replace(/^|$/gm,"#")
   /*
   "#I#
   #love#
   #javascript#"
   */
   ```

5. 字符串 3位一组，以 `,` 分割

   ```js
   "123456789".replace(/(?!^)(?=(\d{3})+$)/g,',')
   >> "123,456,789"
   ```

6. 把 yyyy-mm-dd格式，替换成 mm/dd/yyyy

   ```js
   "2018-05-20".replace(/(\d{4})-(\d{2})-(\d{2})/,"$2/$3/$1")
   >> "05/20/2018"
   ```

7. 