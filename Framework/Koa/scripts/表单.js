/* koa-body模块可以用来从 POST 请求的数据体里面提取键值对。 */
const Koa = require('koa')
const koaBody = require('koa-body')
const app = new Koa()
const elle = 'ni'
const main = ctx => {
  const body = ctx.request.body
  if(!body.name) ctx.throw(400,'name required')
  ctx.response.body = {name:body.name}
}

app.use(koaBody())
app.use(main)
app.listen(3000)
