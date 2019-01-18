function MyClick()
{
    var Input = prompt("请输入一个整数");
    
    try{
        if (Input == parseInt(Input))
        {
            for (var i = 0; i < 5; i++) {

            }
        }
        else
        {
            alert("Wrong");

        }
    }
    catch(e){
        alert("Wrong");
    }
    
}