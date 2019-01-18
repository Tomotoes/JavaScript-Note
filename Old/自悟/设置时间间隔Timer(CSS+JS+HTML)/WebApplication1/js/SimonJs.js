function MyClick()
{
    var i = 0;

    /*第一个参数 是你要做的事情，第一个参数 是间隔的毫秒数*/
    //setInterval(function ()
    //{
    //    ++i;
    //    document.getElementById("d1").innerText = i;
    //}, 1000);
    /*
    解析一下这个函数，设置间隔(Action,Time);
    其中方法，通过document.getElementById("d1") 找到div这个标签，而其中innerText这个属性正是其中显示的值
    也就是内部文本 然后设置内部文本 = i
    联想一下，像不像 C#中的Timer？
    */

    ///*取消之法*/
    //var Time = setInterval(function ()
    //{
    //    ++i;
    //    if (i == 6)
    //    {
    //        clearInterval(Time);//记住此方法，有设置时间间隔，相应的也就有取消时间间隔。
    //    }
    //    document.getElementById("d1").innerText = i;
    //}, 1000);

    setTimeout(function ()
    {
        ++i;
        document.getElementById("d1").innerText = i;
    }, 1000);//结果是一动不动
}
