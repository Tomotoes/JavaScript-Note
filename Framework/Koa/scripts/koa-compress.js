const Koa = require('koa')
const fs = require('fs')
const app = new Koa()
app.use(require('koa-compress')())
app.use(async ctx => {
  ctx.response.type = 'html'
  
  ctx.body = await fs.readFileSync('./scripts/template.html')
})
app.listen(3000, () => {
  console.log('listening...')
})