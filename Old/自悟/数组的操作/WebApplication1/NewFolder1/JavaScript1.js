function MyClick()
{
    //var aTeam = new Array();
    //aTeam[0] = "aaa";
    //aTeam[1] = "bbb";
    //aTeam[2] = "ccc";

    var bTeam = ["aaa", "bbb", "ccc"];//这两种的结果都是一样的 定义一个数组

    //alert(bTeam);//aaa,bbb,ccc

    //alert(bTeam.join("-"));aaa-bbb-ccc

    alert(bTeam.reverse().toString());

    var A="asd-asd-asdwdae";

    var B = A.split("-");

    alert(B[1]);
}