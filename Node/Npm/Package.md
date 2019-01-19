### 意义
1. 作为一个描述文件，描述了你的项目依赖哪些包
2. 允许我们使用 “语义化版本规则”（后面介绍）指明你项目依赖包的版本
3. 让你的构建更好地与其他开发者分享，便于重复使用
4. 有了package.json文件，直接使用npm install命令，就会在当前目录中安装所需要的模块。

### 内容
1. name
> 全部小写，没有空格，可以使用下划线或者横线

2. version
> x.x.x 的格式,符合“语义化版本规则”

3. description
> 描述信息，有助于搜索，有助于别人搜索你的项目，因此建议好好写 description 信息
如果 package.json 中没有 description 信息，npm 使用项目中的 README.md 的第一行作为描述信息。

4. main
> 入口文件，一般都是 index.js

5. scripts
> 支持的脚本，默认是一个空的 test
npm start
npm run [scriptName]

6. keywords
> 关键字，有助于在人们使用 npm search 搜索时发现你的项目

7. author
> 作者信息

8. license
> 默认是 MIT

9. bugs
> 当前项目的一些错误信息，如果有的话

10. dependencies
> 在生产环境中需要用到的依赖

11. devDependencies
> 在开发、测试环境中用到的依赖

12. peerDependencies
> 用来供插件指定其所需要的主工具的版本

13. bin
> 用来指定各个内部命令对应的可执行文件的位置

14. config
> 添加命令行的环境变量
```js
{
  "name" : "foo",
  "config" : { "port" : "8080" },
  "scripts" : { "start" : "node server.js" }
}

然后，在server.js脚本就可以引用config字段的值。
http
  .createServer(...)
  .listen(process.env.npm_package_config_port)
```
用户可以改变这个值。
`npm config set foo:port 80`

15. browser
> 模块浏览器使用的版本

16. engines 
> 模块运行的平台,比如 Node 的某个版本或者浏览器。

17. man
> 指定当前模块的man文档的位置。

18. style
> style指定供浏览器使用时，样式文件所在的位置。

19. preferGlobal
> 布尔值，表示用户不将该模块安装为全局模块时（即不用global参数），是否显示警告，表示该模块的本意就是安装为全局模块。

20. homepage
> 项目官网的url

21. contributors
> 一堆人的数组

22. repository
> 代码存放的地方

23. os
> 运行的操作系统
"os" : [ "darwin", "linux" ]

黑名单
"os" : [ "!win32" ]

24. cpu
> 运行的CPU
如果你的代码只能运行在特定的cpu架构下，你可以指定一个：

"cpu" : [ "x64", "ia32" ]

就像os选项，你也可以黑一个架构：
"cpu" : [ "!arm", "!mips" ]

25. private
> 防止意外发布私有库
如果你设置"private": true，npm就不会发布它。
