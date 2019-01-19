const Koa = require('koa')
const app = new Koa()

const main = async (ctx, next) => {
  ctx.response.type = 'json'
  ctx.response.body = {
    url:ctx.url,
    query: ctx.request.query,
    queryString: ctx.request.queryString
    /* {"url":"/?name=simon","query":{"name":"simon"}} */
  }
  /* http://localhost:3000/?name=Simon */
  if (ctx.request.query.name === 'Simon' && ctx.method==='GET') {
    ctx.response.body='requested'
  }
}

app.use(main)
app.listen(3000)