## HTTP的4种请求：
- GET
- POST
- PUT
- DELETE

URL定位资源，用HTTP动词（GET,POST,DELETE,DETC）描述操作。

GET 查
POST 增，改
DELETE 删
PUT 增

Koa-router 支持 ：get|put|post|patch|delete|del 

koa-router 还可使用 `ALL` 匹配所有请求

## 使用
```js
const Koa = require('koa)
const router = require('koa-router)()
const app = new Koa()

router.get('/',async(ctx,next)=>{
  ctx.response.body = '<h1>Index Page</h1>'
}).post('about',ctx=>{...})
.del(..).put(...).all()

<!-- allowedMethod：若ctx.status为空或者404的时候,丰富response对象的header头 -->
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000,()=>{
  console.log('listening...')
})
```

### 重定向
`router.redirect('/login', '/sign');`
> 访问login，重定向到 sign

### 动态路由
```js
router.get('/:category/:title', (ctx, next) => {
  console.log(ctx.params.title);
  // => { category: 'programming', title: 'how-to-node' }
});
```

### 路由嵌套
```js
let forums = new Router();
let posts = new Router();

posts.get('/', (ctx, next) => {...});
posts.get('/:pid', (ctx, next) => {...});
forums.use('/forums/:fid/posts', posts.routes(), posts.allowedMethods());

// responds to "/forums/123/posts" and "/forums/123/posts/123"
app.use(forums.routes());
```

### 路由前缀
```js
const router = new Router({
  prefix: '/users'
});

router.get('/', ...); // responds to "/users"
router.get('/:id', ...); // responds to "/users/:id"
```

## 通信
### get与post有三种传参方式
  1. 传统方式，通过“？=&”传递参数 
   > tomotoes.com/home?name=Simon&sex=Man
  ```js
  router.get('/home', async(ctx, next) => {
    console.log(ctx.request.query)  //解析之后的对象
    console.log(ctx.request.querystring)  //原字符串
  })
  ```

  2. 通过路径传参 
   > tomotoes.com/:id/blog
  ```js
  router.get('/home/:id/:user', async(ctx, next)=>{
    console.log(ctx.params)
    ctx.response.body = '<h1>HOME page '+ctx.params.id+':'+ctx.params.user+'</h1>'
  })
  ```

  3. post body传参
    > curl -X POST --data "name=kk&name2=gg" 127.0.0.1:7001/api/material
    ```js
    const bodyParser = require('koa-bodyparser')
    app.use(bodyParser()) 
    
    router.get('/user', async(ctx, next)=>{
      ctx.response.body = 
      `
        <form action="/user/register" method="post">
          <input name="name" type="text" placeholder="请输入用户名：ikcamp"/> 
          <br/>
          <input name="password" type="text" placeholder="请输入密码：123456"/>
          <br/> 
          <button>GoGoGo</button>
        </form>
      `
    })

    /* 增加响应表单请求的路由 */
    router.post('/user/register',async(ctx, next)=>{
      /* 利用 ES6 解构 */
      let {name, password} = ctx.request.body
      if( name == 'ikcamp' && password == '123456' ){
        ctx.response.body = `Hello， ${name}！` 
      }else{
        ctx.response.body = '账号信息错误'
      }
    })
    ```