function MyClick() {
    var iNum1 = 10;
    var sNum1 = "123";
    alert(iNum1 - sNum1);//因为参数是string类型 所以加号起到连接作用，减号1起到相减的作用。

    var ONum1 = "10asd";
    alert(iNum1 - ONum1);//会弹出 NaN（is not a number）

    var A = false;
    alert(A.toString());//弹出false

    alert(Number(sNum1));//弹出123

    alert(Number(ONum1));//弹出NaN错误

    alert(parseInt(ONum1));//会弹出10，一直转换到不能转换为止。如果字符串是a123，,弹出便是NaN，如果是1.23，便是1

    alert(parseFloat("1.23a.45"));//会弹出1.23

}