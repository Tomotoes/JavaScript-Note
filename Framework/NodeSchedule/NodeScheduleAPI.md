#### cron的格式组成如下:

```
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    |
│    │    │    │    │    └ 一周的星期 (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── 月份 (1 - 12)
│    │    │    └────────── 月份中的日子 (1 - 31)
│    │    └─────────────── 小时 (0 - 23)
│    └──────────────────── 分钟 (0 - 59)
└───────────────────────── 秒 (0 - 59, OPTIONAL)
```



```js
'*/5 * * * * *' or '0-59/5 * * * * *'
每 5 秒运行一次

'42 * * * *'
每小时的 42 分钟时运行一次

'*/5 * * * *'
每 5 分钟运行一次

'30 1 1 * * 1'
每周1的1点1分30秒触发
```



#### 开始

```js
const schedule = require('node-schedule');

// 每小时的第42分 执行脚本，秒可选哦
schedule.scheduleJob('42 * * * *', function(){
  console.log('生命，宇宙，一切的答案。。。!');
})

```



#### scheduleJob([String/Obj/Date/RecurrenceRule],func)

```js
schedule.scheduleJob('42 * * * *', func)

schedule.scheduleJob({hour: 14, minute: 30, dayOfWeek: 0}, func)

let startTime = new Date(Date.now() + 5000);
let endTime = new Date(startTime.getTime() + 5000);
schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/1 * * * * *' }, func)

const date = new Date(2012, 11, 21, 5, 30, 0);
schedule.scheduleJob(date, func)

const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(4, 6)];
rule.hour = 17;
rule.minute = 0;
schedule.scheduleJob(rule, func)
```



#### job.cancel(reshedule)

你可以让任何任务失效，使用 `cancel()` 方法:

```js
j.cancel();
```

所有的计划调用将会被取消。当你设置 **reschedule** 参数为true，然后任务将在之后重新排列。



#### job.cancelNext(reshedule)

这个方法将能将能取消下一个计划的调度或者任务.
 当你设置 **reschedule** 参数为true，然后任务将在之后重新排列。



#### job.reschedule(spec)

这个方法将取消所有挂起的调度，然后使用给定的规则重新注册任务.
 将返回 true/false 来说明成功/失败.



#### job.nextInvocation()

这个方法返回一个日期对象为这个任务的下一次调用计划，如果没有调度安排，则返回null.



就是说你特别想要一个函数在 2012年12月12日早上5:30执行。
 记住在JavaScript中- 0 - 星期一, 11 - 十二月.（意思就是星期数和月份数都是从0开始计数的）

```js
var schedule = require('node-schedule');
var date = new Date(2012, 11, 21, 5, 30, 0);

var j = schedule.scheduleJob(date, function(){
  console.log('世界将在今天走向 结束.');
});
```



要在未来使用当前数据，你可以使用绑定:

```js
var schedule = require('node-schedule');
var date = new Date(2012, 11, 21, 5, 30, 0);
var x = 'Tada!';
var j = schedule.scheduleJob(date, function(y){
  console.log(y);
}.bind(null,x));
x = 'Changing Data';
```

当调度的任务运行时，这个将会打印出'Tada!'，而不是 'Changing Data'，
 这个x会在调度后立即更改.

 

 **Cron风格定时器-范围触发**

上面的传入参数占位符中还可以传入范围，比如下面示例

```js
var schedule = require('node-schedule');

function scheduleCronstyle(){
    schedule.scheduleJob('1-10 * * * * *', function(){
        console.log('scheduleCronstyle:' + new Date());
    }); 
}

scheduleCronstyle();
```

 

```js
var schedule = require('node-schedule');

function scheduleRecurrenceRule(){

    var rule = new schedule.RecurrenceRule();
    // rule.dayOfWeek = 2;
    // rule.month = 3;
    // rule.dayOfMonth = 1;
    // rule.hour = 1;
    // rule.minute = 42;
    rule.second = 0;
    
    schedule.scheduleJob(rule, function(){
       console.log('scheduleRecurrenceRule:' + new Date());
    });
   
}

scheduleRecurrenceRule();
```

从结果中可以看出，每分钟第60秒时就会触发 