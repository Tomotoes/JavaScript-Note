const Koa = require('koa')
const router = require('koa-router')()
const app = new Koa()

const about = ctx => {
	ctx.response.type = 'html'
	ctx.response.body = `<a href="/">Index Page</a>`
}

router
	.get('/', async (ctx, next) => {
		ctx.response.body = 'Hello Koa'
	})
	.post('/todo', async (ctx, next) => {
		ctx.response.body = 'Todo page'
	})
  .get('/hello', async (ctx, next) => {
    let name = ctx.params.name
    ctx.response.body = `<h1>Hello ${name}，I'm ${ctx.request.query.name}</h1>`
    console.log(ctx.request.query)
    /* http://localhost:3000/Hello/name=Simon?other */
    /* 显示 Hello name=Simon，I'm undefined */

    /* http://localhost:3000/Hello/?name=Simon&&sex=boy */
    /* Hello undefined，I'm Simon */
  })
  .get('/a/:b/w', ctx => {
    ctx.response.body = ctx.params.b
    /* http://localhost:3000/a/name=simon/w */
    /* name=simon */
  })
  .del('/about', about)
  .put('/error', () => { })
  .delete()
  .all()
  // all代表匹配所有，一般放在中间件的末尾

/*
app.use(router.routes());
将router注册到app对象上面。
这样，就可以让router替你接管url和处理函数之间的映射，而不需要你关心真实的访问路径如何。
*/
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, () => {
	console.log('listening...')
})

router.get('/:category/:title', (ctx, next) => {
  console.log(ctx.params);
  // => { category: 'programming', title: 'how-to-node' }
});


/* 路由嵌套 */
var forums = new Router();
var posts = new Router();

// posts.get('/', (ctx, next) => {...});
// posts.get('/:pid', (ctx, next) => {...});
forums.use('/forums/:fid/posts', posts.routes(), posts.allowedMethods());

// responds to "/forums/123/posts" and "/forums/123/posts/123"
app.use(forums.routes());

// const arouter = new Router({
//   prefix: '/users'
// });

// arouter.get('/', null) // responds to "/users"
// arouter.get('/:id', null) // responds to "/users/:id"

// arouter.redirect('/login', 'sign-in');