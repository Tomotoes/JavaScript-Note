/* Koa 的最大特色，也是最重要的一个设计，就是中间件（middleware）。 */
/* 进入网页,发送 HTTP 请求, 运行对应的中间件以及API,再Response回去  */
const Koa = require('koa')
const app = new Koa()

const main = (ctx,next) => {
  ctx.response.body =`${Date.now()} ${ctx.request.method} ${ctx.request.url}` 
  next()
}
/*
像上面代码中的logger函数就叫做"中间件"（middleware），
因为它处在 HTTP Request 和 HTTP Response 中间，用来实现某种中间功能。
app.use()用来加载中间件。

基本上，Koa 所有的功能都是通过中间件实现的，前面例子里面的main也是中间件。
每个中间件默认接受两个参数，第一个参数是 Context 对象，第二个参数是next函数。
只要调用next函数，就可以把执行权转交给下一个中间件。

多个中间件会形成一个栈结构（middle stack），以"先进后出"（first-in-last-out）的顺序执行。

*/

app.use(main)

const one = (ctx, next) => {
  console.log('>> one');
  next();
  console.log('<< one');
}

const two = (ctx, next) => {
  console.log('>> two');
  next(); 
  console.log('<< two');
}

const three = (ctx, next) => {
  console.log('>> three');
  next();
  console.log('<< three');
}

app.use(one);
app.use(two);
app.use(three);

/*  输出
>> one
>> two
>> three
<< three
<< two
<< one */


app.listen(3000)
