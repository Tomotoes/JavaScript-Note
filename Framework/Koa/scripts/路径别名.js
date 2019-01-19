const Koa = require('koa')
const router = require('koa-router')()
const app = new Koa()


router.get('/', (ctx, next) => {
  ctx.body='response'
  ctx.redirect(ctx.router.url('userlimit', { id: 3 }, { query: "limit=1" }));
  // http://localhost:3000/about3?limit=1
})
router.get('userlimit', '/about:id', (ctx, next) => {
  ctx.body='about'
})

// router.url('user', 3);
// // => "/users/3"
 
// router.url('user1', { id: 3 });
// // => "/users/3"

// router.url('user2', { id: 3 }, { query: { limit: 1 } });
// // => "/users/3?limit=1"
 
// router.url('userlimit', { id: 3 }, { query: "limit=1" });
// // => "/users/3?limit=1"

 

app.use(router.routes()).use(router.allowedMethods())
app.listen(3000, () => {
  console.log('listening...')
})