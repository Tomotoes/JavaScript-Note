const Koa = require('koa')
const compose = require('koa-compose')
const router = require('koa-router')

const app = new Koa()

const logger = async (ctx, next) => {
  console.log(`${Date.now()} ${ctx.request.url} ${ctx.request.method}`)
  next()
}

const main = ctx => {
  ctx.response.body='Hello World'
}

const middlewares = compose([logger,main])

app.use(middlewares)
app.listen(3000)