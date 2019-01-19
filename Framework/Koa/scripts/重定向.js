/* 
有些场合，服务器需要重定向（redirect）访问请求。
比如，用户登陆以后，将他重定向到登陆前的页面。
ctx.response.redirect()方法可以发出一个302跳转，将用户导向另一个路由。
 */
const Koa = require('koa')
const route = require('koa-route')

const app = new Koa()

const redirect = ctx => {
  ctx.response.redirect('/')
  ctx.response.body=`<a href="/">Index Page</a>`
}

const main = ctx => {
  ctx.response.body='Hello World!'
}

app.use(route.get('/redirect',redirect))
app.use(route.get('/',main))
app.listen(3000)