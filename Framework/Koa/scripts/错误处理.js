const Koa = require('koa')
const app = new Koa()

const handle = async (ctx,next) => {
 // 500错误 ctx.throw(500)
 // 404错误 ctx.response.status = 404
 
 /* 处理可能错误的中间件 */ 
  try {
    await next()
  } catch (err) {
    ctx.response.status = err.statusCode || err.status || 500
    ctx.response.body = {
      message:err.message
    } 
    ctx.app.emit('error',err,ctx)
 }
}

/* 运行过程中一旦出错，Koa 会触发一个error事件。监听这个事件，也可以处理错误。 */
app.on('error', (err, ctx) => {
  console.log('logging error',err.message)
})

/* 
需要注意的是，如果错误被try...catch捕获，就不会触发error事件。
这时，必须调用ctx.app.emit()，手动释放error事件，才能让监听函数生效。 
*/

const main = ctx => {
  ctx.throw(500)
}
app.use(handle)
app.use(main)
app.listen(3000)