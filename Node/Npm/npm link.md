给模块创建一个符号链接，别名：`npm ln`。

首先，使用 Javascript 创建一个可执行脚本`foo`：

```js
#!/usr/bin/env node
console.log('foo');
```



好，成功创建了一个可执行的 nodejs 应用。可是每次执行都要输入前面的相对路径，这是不能忍受的。我们可以这样解决，创建一个`package.json`文件，写如下内容：

```json
{
    "name": "foo",
    "bin": {
        "foo": "foo"
    }
}
```

然后在当前目录中执行`npm link`，这时候你就可以在电脑的任意目录中输入`foo`来执行刚才创建的应用 了。
