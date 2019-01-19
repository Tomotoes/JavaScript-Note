const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const app = new Koa()

app.use(bodyParser())
app.use(async (ctx, next) => {
	if (ctx.url === '/' && ctx.method === 'GET') {
		let html = `
    <h1>Koa2 request POST</h1>
    <form method="POST" action="/">
        <p>userName</p>
        <input name="userName" /><br/>
        <p>age</p>
        <input name="age" /><br/>
        <p>website</p>
        <input name="webSite" /><br/>
        <button type="submit">submit</button>
    </form>
    `
		ctx.response.body = html
	} else if (ctx.url === '/' && ctx.method === 'POST') {
		let postData = ctx.request.body
    ctx.response.body = postData
    /* {"userName":"Simon","age":"18","webSite":"tomotoes.com"} */
  } else {
    let postData = ctx.request.body
    ctx.response.body = postData
	}
})

app.listen(3000, () => {
	console.log('[demo] server is starting at port 3000')
})
