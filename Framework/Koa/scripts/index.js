const Koa = require('koa')
const app = new Koa()

const main = ctx => {
  ctx.response.body = 'Hello World'
}
/* 访问localhost:3000 或者后面有路径 都会出现 HelloWorld */
/* 一切路由将失效~ */
app.use(main)

app.listen(3000, () => {
  console.log('监听端口ing')
})