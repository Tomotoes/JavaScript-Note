const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()

/* 改变当前路由的底层 */
/* http://localhost:3000/pre 是最底层！ */
const home = new Router({prefix:'/pre'})

home.get('/', async (ctx, next) => {
  ctx.response.body='<h1>Home Hello World</h1>'
}).get('/about', ctx => {
  ctx.response.body='<h1>Home About World</h1>'
})

const page = new Router()

page.get('/', async (ctx, next) => {
  ctx.response.body='<h1>Page Hello World</h1>'
}).get('/about', ctx => {
  ctx.response.body='<h1>Page About World</h1>'
})

const router = new Router()
router.use('/base', home.routes(), home.allowedMethods())
  .use('/abse', page.routes(), page.allowedMethods())

app.use(router.routes()).use(router.allowedMethods())

/* home: 3000/base/pre/about */
/* 先基于层级，再基于前缀构建路由 */
app.listen(3000, () => {
  console.log('Listening...')
})
