## 概念
Koa 提供一个 Context 对象，表示一次对话的上下文（包括 HTTP 请求和 HTTP 回复）。
通过加工这个对象，就可以控制返回给用户的内容。

`Context.response.body` 就是发送给用户的内容。

Context.response 代表的是 HTTP Response
Context.request  代表的是 HTTP Request

Koa 默认的返回类型是**text/plain**，
如果想返回其他类型的内容，可以先用ctx.request.accepts判断一下，客户端希望接受什么数据（
根据 HTTP Request 的Accept字段），然后使用ctx.response.type指定返回类型。


像上面代码中的logger函数就叫做"中间件"（middleware），
因为它处在 HTTP Request 和 HTTP Response 中间，用来实现某种中间功能。
app.use()用来加载中间件
next 是调用执行下游中间件的函数. 
在代码执行完成后通过 then 方法**返回一个 Promise**。

基本上，Koa 所有的功能都是通过中间件实现的，前面例子里面的main也是中间件。
每个中间件默认接受两个参数，第一个参数是 Context 对象，第二个参数是next函数。
只要调用next函数，就可以把执行权转交给下一个中间件。

多个中间件会形成一个栈结构（middle stack），以"先进后出"（first-in-last-out）的顺序执行。


Koa 的最大特色，也是最重要的一个设计，就是中间件（middleware）。 */
进入网页,发送 HTTP 请求, 运行对应的中间件以及API,再Response回去  */

如果网站提供静态资源（图片、字体、样式表、脚本......），为它们一个个写路由就很麻烦，也没必要。
koa-static模块封装了这部分的请求。 
然后 进入 localhost:3000/静态资源.js 就可以看见了！

有些场合，服务器需要重定向（redirect）访问请求。
比如，用户登陆以后，将他重定向到登陆前的页面。
ctx.response.redirect()方法可以发出一个302跳转，将用户导向另一个路由。


如果有异步操作（比如读取数据库），中间件就必须写成 async 函数
如果中间件 同时操纵了 response.body 那么后面的操作会覆盖前面的哦


app.context 是从其创建 ctx 的原型。您可以通过编辑 app.context 为 ctx 添加其他属性。
app.context.db = db();
  
  app.use(async ctx => {
    console.log(ctx.db);
  });

  ctx.app
应用程序实例引用



request.header
请求标头对象


request.method
请求方法。


request.url
获取请求 URL.


request.href
获取完整的请求URL

request.query
获取解析的查询字符串, 当没有查询字符串时，返回一个空对象。

request.ip
请求远程地址。


request.accepts(types)
检查给定的 type(s) 是否可以接受，如果 true，返回最佳匹配，否则为 false。


response.header
响应标头对象。


response.status
获取响应状态。默认情况下，response.status 设置为 404 而不是像 node 的 res.statusCode 那样默认为 200。


response.redirect(url, [alt])
执行 [302] 重定向到 url.