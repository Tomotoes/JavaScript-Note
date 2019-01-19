const Koa = require('koa')
const app = new Koa()

const main = async (ctx, next) => {
  ctx.response.type='html'
  ctx.body = {
    request:ctx.request
  }
  console.log('PM2!!')
}

app.callback(() => {
  console.log('Collback!')
})

app.use(main)
app.listen(3000)