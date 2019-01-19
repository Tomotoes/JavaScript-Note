/* context.state 中间件共享状态 */

const Koa = require('koa')
const app = new Koa()

const main = (ctx, next) => {
  ctx.state = 'main'
  next()
}

const about = ctx => {
  ctx.body = ctx.state
}

app.use(main)
app.use(about)
app.listen(3000, () => {
  console.log('listening...')
})