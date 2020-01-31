function MyClick()
{
    var MyDate = new Date();
    alert(MyDate.getFullYear());//获取当前年份
    alert(MyDate.getMonth() + 1);//值得注意的是 月份是从0开始的，所以我们要加1..也搞不明白为什么这么设定。
    alert(MyDate.getDay());//获取当前星期数
    alert(MyDate.getDate());//获取当前日期。几号
    alert(MyDate.getHours());//获取当前小时，等等
}