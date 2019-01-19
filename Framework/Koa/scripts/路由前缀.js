const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()

/* 改变当前路由的底层 */
/* http://localhost:3000/pre 是最底层！ */
const router = new Router({
  prefix:'/pre'
})

router.get('/', async (ctx, next) => {
  ctx.response.body='<h1>Hello World</h1>'
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, () => {
  console.log('Listening...')
})
