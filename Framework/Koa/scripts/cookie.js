const Koa = require('koa')
const app = new Koa()

/*
ctx.cookies.set(
  'MyName','JSPang',{
      domain:'127.0.0.1', // 写cookie所在的域名
      path:'/index',       // 写cookie所在的路径
      maxAge:1000*60*60*24,   // cookie有效时长
      expires:new Date('2018-12-31'), // cookie失效时间
      httpOnly:false,  // 是否只用于http请求中获取
      overwrite:false  // 是否允许重写
  }
);
*/
const main = ctx => {
	const n = Number(ctx.cookies.get('view') || 0) + 1
	ctx.cookies.set('view', n)
	ctx.response.body = `${n} view${n > 1 ? 's' : ''}`
}

app.use(main)
app.listen(3000)
