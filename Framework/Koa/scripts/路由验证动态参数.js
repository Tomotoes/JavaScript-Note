const Koa = require('koa')
const router = require('koa-router')()

const app = new Koa()

router.get('/:id/:name', async (ctx, next) => {
  ctx.body = ctx.params.id + '---' + ctx.params.name
  //http://localhost:3000/sadd/wqe
}).param('id', id => {
  //这里的id 就是 访问的Url 中的 sadd！！
  validate(id)
  console.log(id)
})

const validate = data => {
  // do something...
}
app.use(router.routes()).use(router.allowedMethods())
app.listen(3000, () => {
  console.log('listening...')
})