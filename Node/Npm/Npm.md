### 概念
1. 一个网站，用于搜索 JS 模块的[网站](https://www.npmjs.com/)
2. 一个仓库，保存着人们分享的 JS 模块的大数据库
3. 命令行里的客户端，开发者使用它来管理、安装、发布模块

## 钩子

npm 脚本有`pre`和`post`两个钩子。举例来说，`build`脚本命令的钩子就是`prebuild`和`postbuild`。 

用户执行`npm run build`的时候，会自动按照下面的顺序执行。 

```js
npm run prebuild && npm run build && npm run postbuild


"clean": "rimraf ./dist && mkdir dist",
"prebuild": "npm run clean",
"build": "cross-env NODE_ENV=production webpack"
```

npm 默认提供下面这些钩子。 

```js
prepublish，postpublish
preinstall，postinstall
preuninstall，postuninstall
preversion，postversion
pretest，posttest
prestop，poststop
prestart，poststart
prerestart，postrestart
```

自定义的脚本命令也可以加上`pre`和`post`钩子。

比如，`myscript`这个脚本命令，也有`premyscript`和`postmyscript`钩子。 

注意，`prepublish`这个钩子不仅会在`npm publish`命令之前运行，还会在`npm install`（不带任何参数）命令之前运行。

这种行为很容易让用户感到困惑，所以 npm 4 引入了一个新的钩子`prepare`，行为等同于`prepublish`，而从 npm 5 开始，`prepublish`将只在`npm publish`命令之前运行。 



## 变量

npm 提供一个`npm_lifecycle_event`变量，返回当前正在运行的脚本名称，比如`pretest`、`test`、`posttest`等等。

所以，可以利用这个变量，在同一个脚本文件里面，为不同的`npm scripts`命令编写代码。请看下面的例子。

```js
const TARGET = process.env.npm_lifecycle_event;

if (TARGET === 'test') {
  console.log(`Running the test task!`);
}

if (TARGET === 'pretest') {
  console.log(`Running the pretest task!`);
}

if (TARGET === 'posttest') {
  console.log(`Running the posttest task!`);
}
```

npm 脚本有一个非常强大的功能，就是可以使用 npm 的内部变量。 

首先，通过`npm_package_`前缀，npm 脚本可以拿到`package.json`里面的字段。比如，下面是一个`package.json`。

```
{
  "name": "foo", 
  "version": "1.2.5",
  "scripts": {
    "view": "node view.js"
  }
}
```

那么，变量`npm_package_name`返回`foo`，变量`npm_package_version`返回`1.2.5`。

```
// view.js
console.log(process.env.npm_package_name); // foo
console.log(process.env.npm_package_version); // 1.2.5
```

上面代码中，我们通过环境变量`process.env`对象，拿到`package.json`的字段值。如果是 Bash 脚本，可以用`$npm_package_name`和`$npm_package_version`取到这两个值。

`npm_package_`前缀也支持嵌套的`package.json`字段。

```
  "repository": {
    "type": "git",
    "url": "xxx"
  },
  scripts: {
    "view": "echo $npm_package_repository_type"
  }
```

上面代码中，`repository`字段的`type`属性，可以通过`npm_package_repository_type`取到。

下面是另外一个例子。

```
"scripts": {
  "install": "foo.js"
}
```

上面代码中，`npm_package_scripts_install`变量的值等于`foo.js`。

然后，npm 脚本还可以通过`npm_config_`前缀，拿到 npm 的配置变量，即`npm config get xxx`命令返回的值。比如，当前模块的发行标签，可以通过`npm_config_tag`取到。

```
"view": "echo $npm_config_tag",
```

注意，`package.json`里面的`config`对象，可以被环境变量覆盖。

```
{ 
  "name" : "foo",
  "config" : { "port" : "8080" },
  "scripts" : { "start" : "node server.js" }
}
```

上面代码中，`npm_package_config_port`变量返回的是`8080`。这个值可以用下面的方法覆盖。

```
$ npm config set foo:port 80
```

最后，`env`命令可以列出所有环境变量。

```
"env": "env"
```

### 命令

#### 创建项目配置文件
1. npm init
> 在本地创建`package.json`，需要回答信息
2. npm init -y/-f
> 不必回答，使用默认信息，在本地创建`package.json`

#### 安装
1. npm install pkg
> 安装包，默认会安装最新的版本
*别名：npm i pkg*

2. npm install pkg@3.9.1
> 安装指定版本

3. npm install gulp --save
> 安装到生产依赖
*别名：npm i -S pkg*

4. npm install gulp --save-dev 
> 安装到开发阶段依赖
*别名：npm i -D pkg*

5. npm install gulp --save-optional
> 安装到可选阶段的依赖
*别名：npm i -O pkg*

**生产环境 与 开发环境的区别就是 打包文件时，是否将一些包也加进去** 

6. npm install gulp --save-exact
> 安装指定模块版本
*别名：npm i -E pkg*

7. npm install
> 默认安装 package.json 中 dependencies字段所列出的包

8. npm uninstall [<@scope>/]<pkg>[@<version>]... [-S|--save|-D|--save-dev|-O|--save-optional]
> 卸载模块 
*别名：remove rm r un unlink*

9. npm install -g pkg
> 全局安装

#### 更新
1. npm update [-g] [<pkg>...]
> 更新模块

2. npm outdated [[<@scope>/]<pkg> ...]
> 检查模块是否已经过时

#### 其他
1. npm help
> 查看 npm 命令列表

2. npm -l
> 查看各个命令的简单用法

3. npm search <搜索词>
> 用于搜索npm仓库

#### 启动
1. npm start [-- <args>]
> 启动模块

2. npm stop
> 停止模块

3. npm restart
> 重新启动模块

4. npm test
> 测试模块
*别名 npm t*

5. npm run
> 列举出 所有可运行脚本

#### 查看信息
1. npm version
> 查看版本

2. npm view [<@scope>/]<name>[@<version>] [<field>[.<subfield>]...]
> 查看模块的注册信息
*别名：info show v*

3. npm ls [[<@scope>/]<pkg> ...]
> 查看安装模块
> *别名：list ll la*

4. npm link
> 可以将一个任意位置的npm包链接到全局执行环境，从而在任意位置使用命令行都可以直接运行该npm包。
> **前提需要修改 package.json 文件，新增 bin 字段**

5. npm unlink
> 删除符号链接。

6. npm bin
> 可执行脚本所在的目录

7. npm prune
> 检查当前项目的node_modules目录中，是否有package.json里面没有提到的模块

8. npm root [pkg]
> 得到当前项目使用模块的路径

#### 打开网站
1. npm home [pkg]
> 打开一
>
> - ```
>   
>   ```
>
> 个模块的主页,如果没有指定 pkg ，默认打开当前项目的网站

2. npm repo
> 打开一个模块的代码仓库，如果没有指定 pkg ，默认打开当前项目的网站

#### 包
1. npm adduser [--registry=url][--scope=@orgname] [--always-auth]
> 在npmjs.com注册一个用户。

2. npm publish [<tarball>|<folder>][--tag ] [--access <public|restricted>]
> 将当前模块发布到npmjs.com
> --tag beta
> 标记标签发布

  --scope=yourscope
  > 发布为私密包，付费账户特权

3. npm login
> 登录

#### 维护者

1. npm owner ls <package name>
> 列出指定模块的维护者

2. npm owner add <user> <package name>
> 新增维护者

3. npm owner rm <user> <package name>
> 删除维护者

