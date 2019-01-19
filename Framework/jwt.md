### API
1. jwt.sign(payload, secretOrPrivateKey, [options, callback])
> 生成Token
payload 必须是一个object, buffer或者string。
如果payload不是buffer或string，它将被强制转换为使用的字符串JSON.stringify()。

1. 载荷就是存放有效信息的地方。包含三个部分:
  1. 公共的声明
  > 公共的声明可以添加任何的信息，一般添加用户的相关信息或其他业务需要的必要信息.但不建议添加敏感信息，因为该部分在客户端可解密.
    
  2. 私有的声明
  > 私有声明是提供者和消费者所共同定义的声明，一般不建议存放敏感信息，因为base64是对称解密的，意味着该部分信息可以归类为明文信息。
    
  3. 标准中注册的声明 (建议但不强制使用) ：
    iss: jwt签发者
    sub: jwt所面向的用户
    aud: 接收jwt的一方
    exp: jwt的过期时间，这个过期时间必须要大于签发时间
    nbf: 定义在什么时间之前，该jwt都是不可用的.
    iat: jwt的签发时间
    jti: jwt的唯一身份标识，主要用来作为一次性token,从而回避重放攻击。

定义一个payload:
```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}
```

2. secretOrPrivateKey 
> 是包含HMAC算法的密钥或RSA和ECDSA的PEM编码私钥的string或buffer。
secret是保存在服务器端的，jwt的签发生成也是在服务器端的，secret就是用来进行jwt的签发和jwt的验证，
所以，它就是你服务端的私钥，在任何场景都不应该流露出去。
一旦客户端得知这个secret, 那就意味着客户端是可以自我签发jwt了。

3. options:
    algorithm：加密算法（默认值：HS256）
    expiresIn：以秒表示或描述时间跨度zeit / ms的字符串。如60，"2 days"，"10h"，"7d"，Expiration time，过期时间
    notBefore：以秒表示或描述时间跨度zeit / ms的字符串。如：60，"2days"，"10h"，"7d"
    audience：Audience，观众
    issuer：Issuer，发行者
    jwtid：JWT ID
    subject：Subject，主题
    noTimestamp
    header

```js
// sign with default (HMAC SHA256)
var jwt = require('jsonwebtoken');
var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
//backdate a jwt 30 seconds
var older_token = jwt.sign({ foo: 'bar', iat: Math.floor(Date.now() / 1000) - 30 }, 'shhhhh');

// sign with RSA SHA256
var cert = fs.readFileSync('private.key');  // get private key
var token = jwt.sign({ foo: 'bar' }, cert, { algorithm: 'RS256'});

// sign asynchronously
jwt.sign({ foo: 'bar' }, cert, { algorithm: 'RS256' }, function(err, token) {
  console.log(token);
});

jwt.sign({
  exp: Math.floor(Date.now() / 1000) + (60 * 60),
  data: 'foobar'
}, 'secret');

jwt.sign({
  data: 'foobar'
}, 'secret', { expiresIn: 60 * 60 });

//or even better:

jwt.sign({
  data: 'foobar'
}, 'secret', { expiresIn: '1h' });
```
2. jwt.verify(token，secretOrPublicKey，[options，callback])
> 验证token的合法性 返回 payload 中的信息
```js
// verify a token symmetric - synchronous
var decoded = jwt.verify(token, 'shhhhh');
console.log(decoded.foo) // bar

// verify a token symmetric
jwt.verify(token, 'shhhhh', function(err, decoded) {
  console.log(decoded.foo) // bar
});

// invalid token - synchronous
try {
  var decoded = jwt.verify(token, 'wrong-secret');
} catch(err) {
  // err
}

// invalid token
jwt.verify(token, 'wrong-secret', function(err, decoded) {
  // err
  // decoded undefined
});

// verify a token asymmetric
var cert = fs.readFileSync('public.pem');  // get public key
jwt.verify(token, cert, function(err, decoded) {
  console.log(decoded.foo) // bar
});

// verify audience
var cert = fs.readFileSync('public.pem');  // get public key
jwt.verify(token, cert, { audience: 'urn:foo' }, function(err, decoded) {
  // if audience mismatch, err == invalid audience
});

// verify issuer
var cert = fs.readFileSync('public.pem');  // get public key
jwt.verify(token, cert, { audience: 'urn:foo', issuer: 'urn:issuer' }, function(err, decoded) {
  // if issuer mismatch, err == invalid issuer
});

// verify jwt id
var cert = fs.readFileSync('public.pem');  // get public key
jwt.verify(token, cert, { audience: 'urn:foo', issuer: 'urn:issuer', jwtid: 'jwtid' }, function(err, decoded) {
  // if jwt id mismatch, err == invalid jwt id
});

// verify subject
var cert = fs.readFileSync('public.pem');  // get public key
jwt.verify(token, cert, { audience: 'urn:foo', issuer: 'urn:issuer', jwtid: 'jwtid', subject: 'subject' }, function(err, decoded) {
  // if subject mismatch, err == invalid subject
});

// alg mismatch
var cert = fs.readFileSync('public.pem'); // get public key
jwt.verify(token, cert, { algorithms: ['RS256'] }, function (err, payload) {
  // if token alg != RS256,  err == invalid signature
});
```
3. jwt.decode(token [，options])
> （同步）返回解码没有验证签名是否有效的payload
> 警告：这不会验证签名是否有效。你应该不为不可信的消息使用此。你最有可能要使用jwt.verify()。
  ### TokenExpiredError
  如果令牌过期，则抛出错误。

  错误对象：
    name：'TokenExpiredError'
    message：'jwt expired'
    expiredAt：[ExpDate]
    JsonWebTokenError
    错误对象：
    name：'JsonWebTokenError'
    message：
      jwt异常
      jwt签名是必需的
      无效签名
      jwt观众无效 预期：[OPTIONS AUDIENCE]
      jwt发行人无效。预期：[OPTIONS ISSUER]
      jwt id无效。预期：[OPTIONS JWT ID]
      jwt主题无效。预期：[OPTIONS SUBJECT]


4. 发送请求携带 Token
```js
fetch('api/user/1', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
})
```

### 基本概念
> Json web token (JWT), 是为了在网络应用环境间传递声明而执行的一种基于JSON的开放标准（(RFC 7519).该token被设计为紧凑且安全的，特别适用于分布式站点的单点登录（SSO）场景。JWT的声明一般被用来在身份提供者和服务提供者间传递被认证的用户身份信息，以便于从资源服务器获取资源，也可以增加一些额外的其它业务逻辑所必须的声明信息，该token也可直接被用于认证，也可被加密。

JWT是由三段信息构成的，将这三段信息文本用.链接一起就构成了Jwt字符串。就像这样:
```js
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrH
```

### JWT的构成
第一部分我们称它为头部（header),
第二部分我们称其为载荷（payload)，
第三部分是签证（signature).

#### header
> jwt的头部承载两部分信息：
声明类型，这里是jwt
声明加密的算法 通常直接使用 HMAC SHA256
完整的头部就像下面这样的JSON：
```js
{
  'typ': 'JWT',
  'alg': 'HS256'
}
```
然后将头部进行base64加密（该加密是可以对称解密的),构成了第一部分.
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9

常规的token保存在sessionStorage或者localStorage中，每次请求时将token加在http请求的Header中，

#### 典型的token认证方式：

1.客户端登录时通过账号和密码到服务端进行认证，认证通过后，服务端通过持有的密钥生成Token，
  Token中一般包含失效时长和用户唯一标识，如用户ID，
  服务端返回Token给客户端；

2.客户端保存服务端返回的Token；
3.客户端进行业务请求时在Head的Authorization字段里面放置Token，
  如： Authorization: Bearer Token 
  
4.服务端对请求的Token进行校验，如果Token不是存放在Cookie中，需要解决用户主动注销，但设置的过期时间并未过期问题。