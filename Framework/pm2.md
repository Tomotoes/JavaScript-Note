## 概念
pm2 是一个带有负载均衡功能的Node应用的进程管理器，
包括守护进程，监控，日志的一整套完整的功能，基本是Nodejs应用程序不二的守护进程选择，
事实上它并不仅仅可以启动Nodejs的程序，只要是一般的脚本的程序它同样可以胜任。



## 命令
### 启动
`pm2 start app.js`
> 启动 app.js 应用程序

`pm2 start script.sh `
> 启动 bash 脚本

`pm2 start app.js -i 4`
> cluster mode 模式启动4个app.js的应用实例 , 4个应用程序会自动进行负载均衡
> 还可以设置关键字 max，根据当前机器核数确定实例数目

`pm2 scale api 10`
> 把名字叫api的应用扩展到10个实例

`pm2 start app.js --name="api"`
> 启动应用程序并命名为 "api"

`pm2 start app.js --watch`
> 当文件变化时自动重启应用，如果要精确监听、不见听的目录，最好通过配置文件。
> --ignore-watch：排除监听的目录/文件，可以是特定的文件名，也可以是正则。
比如--ignore-watch="test node_modules "some scripts""

### 查看
`pm2 list`
> 列表 PM2 启动的所有的应用程序

`pm2 list --sort=<field>`
> 返回根据字段排序后的列表

`pm2 monit`
> 显示每个应用程序的CPU和内存占用情况

`pm2 show [app-name]`
> 显示应用程序的所有信息

`pm2 logs ['all'|app_name|app_id] [--json] [--format] [--raw]`
> 显示指定应用程序的日志

`pm2 reloadLogs`
> 重启所有日志

### 关闭
`pm2 stop <app_name|id|'all'|json_conf>`
> 停止指定的应用程序

`pm2 restart <app_name|id|'all'|json_conf>`
> 重启指定的应用

`pm2 reload all`
> 重启 cluster mode下的所有应用

`pm2 delete <app_name|id|'all'|json_conf>`
> 关闭并删除指定的应用

### 其他
`pm2 save`
> 保存当前应用列表

`pm2 update`
> 保存进程，关闭 pm2,重启进程

`pm2 startup`   
> 检测init系统, 在启动时生成并配置pm2引导

`pm2 resurrect`   
> 恢复先前保存的进程

`pm2 unstartup`   
> 禁用并删除启动系

`pm2 init`   
> 生成一个样本js配置

### 部署
`pm2 deploy app.json prod setup`
> 设置“prod”远程服务器

`pm2 deploy app.json prod`
> 更新“prod”遥控器

`pm2 deploy app.json prod revert 2`
> 将“prod”远程服务器恢复2

### 模块系统
`pm2 module:generate [name]`
> 用名称[名称]生成样品模块

`pm2 install pm2-logrotate`
> 安装模块（这里是一个日志轮换系统）

`pm2 uninstall pm2-logrotate`
> 卸载模块

`pm2 publish`
> 增量版本, git push and npm publish


## 实战
配置文件实例:
```json
{
  "name"        : "fis-receiver",  // 应用名称
  "script"      : "./bin/www",  // 实际启动脚本
  "cwd"         : "./",  // 当前工作路径
  "watch": [  // 监控变化的目录，一旦变化，自动重启
    "bin",
    "routers"
  ],
  "ignore_watch" : [  // 从监控目录中排除
    "node_modules", 
    "logs",
    "public"
  ],
  "watch_options": {
    "followSymlinks": false
  },
  "error_file" : "./logs/app-err.log",  // 错误日志路径
  "out_file"   : "./logs/app-out.log",  // 普通日志路径
  "env": {
      "NODE_ENV": "production"  // 环境参数，当前指定为生产环境
  }
}
```


自定义启动文件

创建一个test.json的示例文件，格式如下：
```json

{
  "apps":
    {
      "name": "test",
      "cwd": "/data/wwwroot/nodejs",
      "script": "./test.sh",
      "exec_interpreter": "bash",
      "min_uptime": "60s",
      "max_restarts": 30,
      "exec_mode" : "cluster_mode",
      "error_file" : "./test-err.log",
      "out_file": "./test-out.log",
      "pid_file": "./test.pid"
      "watch": false
    }
}
```

说明：
apps：json结构，apps是一个数组，每一个数组成员就是对应一个pm2中运行的应用
name：应用程序的名称
cwd：应用程序所在的目录
script：应用程序的脚本路径
exec_interpreter：应用程序的脚本类型，这里使用的shell，默认是nodejs
min_uptime：最小运行时间，这里设置的是60s即如果应用程序在60s内退出，pm2会认为程序异常退出，此时触发重启max_restarts设置数量
max_restarts：设置应用程序异常退出重启的次数，默认15次（从0开始计数）
exec_mode：应用程序启动模式，这里设置的是cluster_mode（集群），默认是fork
error_file：自定义应用程序的错误日志文件
out_file：自定义应用程序日志文件
pid_file：自定义应用程序的pid文件
watch：是否启用监控模式，默认是false。如果设置成true,当应用程序变动时，pm2会自动重载。也可以设置你要监控的文件。



已上面的test.json为例

\# cat > /data/wwwroot/nodejs/test.sh << EOF

\#!/bin/bash

while :
do
    echo "Test" >> 1.log
    sleep 5
done
EOF

\# chmod +x test.sh      #添加执行权限

\# pm2 start test.json    #启动，如下图：

\# pm2 list    #查看pm2进程，如下图：