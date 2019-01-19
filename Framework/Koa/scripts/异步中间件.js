/* 如果有异步操作（比如读取数据库），中间件就必须写成 async 函数。 */

const Koa = require('koa')
const fs = require('fs')
const app = new Koa()

const main = async (ctx, next) => {
  ctx.response.type='html'
  ctx.response.body = await fs.readFileSync('./scripts/template.html','utf8')
  next()
}
const end = ctx => {
  ctx.response.body='End!'
}
app.use(main)
app.use(end)
app.listen(3000)

