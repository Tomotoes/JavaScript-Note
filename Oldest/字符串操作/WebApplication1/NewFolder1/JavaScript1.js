function MyClick()
{
    var sString = " I Love LiuLin";

    alert(sString.length);
    
    var Postion = sString.charAt(2);

    alert(sString.charAt(3));//输出指定位置的字符

    //字符串的截取
    alert(sString.substring(1));

    alert(sString.substring(1, 5));//开始位置，结束位置

    alert(sString.substr(1, 5));//开始位置，截取长度

    alert(sString.indexOf("I", 4));//在索引4以后I的出现位置，不存在输出-1，还有LastindexOf

}