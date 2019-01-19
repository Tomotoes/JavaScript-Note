### API

1. genSalt
> 生成盐
`bcrypt.genSalt(密码强度系数,callback(err,生成的盐))`
`bcrypt.genSalt(密码强度系数) 返回生成的盐`
```js
bcrypt.genSalt(10, function(err, salt) { }) 
```

2. compare
> 验证密码
`bcrypt.compare(需要验证的密码,生成的hash密码) 返回布尔值，是否验证正确`
`bcrypt.compare(需要验证的密码,生成的hash密码,callback(err,验证的结果){})`

3. hash
> 生成hash密码
`bcrypt.hash(需加密的密码,盐,callback(err,生成的hash密码))`
`bcrypt.hash(需加密的密码,盐) 返回生成的hash密码`

4. 难度系数
1-4 一个阶级
4-8 一个阶级
8+ 一个阶级

**对应的API默认异步，但是有同步版本！APISync**
**返回一个promise**

5. 技巧
- 加密通常定义 UserSchema.pre('save')

6. 其他API

- getSalt(hash)
> 得到盐

- getRounds(hash)
> 得到加密系数


```js
const bcrypt = require('bcryptjs');

//生成 hash密码
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync("B4c0/\/", salt);
bcrypt.genSalt(10, function(err, salt) {
  bcrypt.hash("B4c0/\/", salt, function(err, hash) {
      // Store hash in your password DB.
  });
});

//密码验证
bcrypt.compareSync("B4c0/\/", hash); // true
bcrypt.compareSync("not_bacon", hash); // false
// Load hash from your password DB.
bcrypt.compare("B4c0/\/", hash, function(err, res) {
    // res === true
});
bcrypt.compare("not_bacon", hash, function(err, res) {
    // res === false
});

// As of bcryptjs 2.4.0, compare returns a promise if callback is omitted:
bcrypt.compare("B4c0/\/", hash).then((res) => {
    // res === true
});

//生成hash值
const hash = bcrypt.hashSync('bacon', 8);
bcrypt.hash('bacon', 8, function(err, hash) {

});

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    username: ...
    ... ...
  },
  {timestamps: true}
)

// 钩子函数，指定 save() 之前的操作
UserSchema.pre('save', function (next) {
  const user = this
  // 上文中的“缓慢参数”
  const SALT_FACTOR = 10
  // 随机生成盐
  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) return next(err)
    // 加盐哈希
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) return next(err)
      user.password = hash
      next()
    })
  })
})

UserSchema.methods.comparePassword = function (password, cb) {
  // 对比
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) { return cb(err) }
    cb(null, isMatch)
  })
}

module.exports = mongoose.model('User', UserSchema)


 // 对比 用户登录表单中的密码 和 数据库中记录的密码
user.comparePassword(password, function (err, isMatch) {
  if (err) { return console.log(err) }
  // 密码不匹配
  if (!isMatch) {
    return res.status(403).json({
      error: 'invaild username or password'
    })
  }
  // 匹配成功
  return res.json({
    user: { ... }
    token: ...
  })
})

// 定义加密密码计算强度
var SALT_WORK_FACTOR = 10;

// 连接数据库
mongoose.connect('mongodb://localhost:27017/test');

//定义用户模式
var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: {
        unique: true,
        type: String
    }
}, {
    collection: "user"
});

//使用pre中间件在用户信息存储前进行密码加密
UserSchema.pre('save', function(next) {
  var user = this;

  //进行加密
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if(err) {
        return next(err);
    }
    bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
  });
});

//编译模型
var UserBx = mongoose.model('UserBx', UserSchema);

//创建文档对象实例
var user = new UserBx({
  name: 'lidan',
  password: '12345'
});

//保存用户信息
user.save(function(err, user) {
  if(err) {
    console.log(err);
  }else {
    // 如果保存成功，打印用户密码
    console.log('password:' + user.password);
  }
})


//引入bcrypt模块
var bcrypt = require('bcrypt');

//POST /signup用户注册
router.post('/', checkNotLogin, function(req, res, next){
  let password = req.fields.password   //获取注册页面上表单输入的密码

  //生成salt的迭代次数
  const saltRounds = 10;
  //随机生成salt
  const salt = bcrypt.genSaltSync(saltRounds);
  //获取hash值
  var hash = bcrypt.hashSync(password, salt);
    //把hash值赋值给password变量
  password = hash;

  storeUInfo();
  //存储用户信息
function storeUInfo(){
  let user = {
    name: name,
    password: password,     //把加密后的密码存入数据库
    gender: gender,
    avatar: avatar,
    bio: bio
  }
  //用户信息写入数据库
  UserModel.create(user)
  .then(function(result){
    //此时user是插入mongodb后的值，包含_id
    user = result.ops[0];
    //删除密码这种敏感信息，将用户信息存入session
    delete user.password
    //注册成功后跳转到首页
    res.redirect('/posts')
  })
  .catch(function(e){
      //用户名被占用则跳回注册页，而不是错误页
    if(e.message.match('duplicate key')){
        req.flash('error','用户名已被占用')
        return res.redirect('/signup')
    }
    next(e)
  })
} 


//POST /signin  用户登录
router.post('/', checkNotLogin, function(req, res, next){
  const password = req.fields.password  //获取登录页面上表单输入的密码

  UserModel.getUserByName(name)
  .then(function(user){
      //检查数据库里的密码和用户输入的密码是否匹配,user.password为数据库里存储的密码
    const pwdMatchFlag =bcrypt.compareSync(password, user.password);
    if(pwdMatchFlag){
        ...
        res.redirect('/posts')   //匹配成功跳转到主页
    }else{
        ...
        return res.redirect('back') //匹配失败返回之前的页面
    }
  })
  .catch(next)
})

//POST /signup用户注册
router.post('/', checkNotLogin, function(req, res, next){
  let password = req.fields.password   //获取注册页面上表单输入的密码

  //生成salt的迭代次数
  const saltRounds = 10;
    //生成salt并获取hash值
  bcrypt.genSalt(saltRounds, function(err, salt){
    bcrypt.hash(password,salt, function(err, hash){
      //把hash值赋值给password变量
      password = hash;
      storeUInfo();
    })
  })

    //存储用户信息
  function storeUInfo(){
    let user = {
      name: name,
      password: password,     //把加密后的密码存入数据库
      gender: gender,
      avatar: avatar,
      bio: bio
    }
  //用户信息写入数据库
    UserModel.create(user)
    .then(function(result){
      //此时user是插入mongodb后的值，包含_id
      user = result.ops[0];
      //删除密码这种敏感信息，将用户信息存入session
      delete user.password
      //注册成功后跳转到首页
      res.redirect('/posts')
    })
    .catch(function(e){
      //用户名被占用则跳回注册页，而不是错误页
      if(e.message.match('duplicate key')){
          req.flash('error','用户名已被占用')
          return res.redirect('/signup')
      }
      next(e)
    })
} 


//POST /signin  用户登录
router.post('/', checkNotLogin, function(req, res, next){
  const password = req.fields.password  //获取登录页面上表单输入的密码

  UserModel.getUserByName(name)
  .then(function(user){
    //检查数据库里的密码和用户输入的密码是否匹配,user.password为数据库里存储的密码
    bcrypt.compare(password, user.password,function(err,res){
        const pwdMatchFlag = res;
        tryLogin(pwdMatchFlag);
    })
    // 尝试登录
    function tryLogin(pwdMatchFlag){
      if(pwdMatchFlag){
          ...
          res.redirect('/posts')   //匹配成功跳转到主页
      }else{
          ...
          return res.redirect('back') //匹配失败返回之前的页面
      }
    }
  })
  .catch(next)
})
```
