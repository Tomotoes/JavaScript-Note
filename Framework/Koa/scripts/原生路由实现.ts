const Koa = require('koa')
const fs = require('fs')
const app = new Koa()

function render(pageUrl: string):Promise<object> {
  return new Promise((resolve, reject) => {
    fs.readFile(pageUrl, 'binary', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

async function route(url: string): Promise<object> {
	let page = '404.html'
	switch (url) {
		case '/':
			page = 'index.html'
			break
		case '/index':
			page = 'index.html'
			break
		case '/todo':
			page = 'todo.html'
			break
		case '/404':
			page = '404.html'
			break
		default:
			break
  }
  let html = await render(page)
  return html
}

const main = async (ctx, next) => {
	let url = ctx.request.url
	let html = await route(url)
	ctx.response.body = html
}

app.use(main)
app.listen(3000)
