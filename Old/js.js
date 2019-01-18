console.log(1);

export var firstName="Simon";

let a=1,b=2,c=3;
export {a,b,c};

export function Show(){
    console.log('Show');
}

function JUMP(){
    console.log('Jump');
}

export{
    JUMP as Jump,
    a as A,
}

export var m = 1;

var n = 1;
export {n};

var p;
export {p as n}

/*
1. export 规定的是向外输出的接口
2. import 
*/