/* 在计算机科学中，柯里化（Currying），又译为卡瑞化或加里化，是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。这个技术由克里斯托弗·斯特雷奇以逻辑学家哈斯凯尔·加里命名的 */
/* 柯里化(Currying)具有：延迟计算、参数复用、动态生成函数的作用。*/
let curry1 = (function () {
    let args = [];
    return function () {
        if (!!arguments.length) {
            args.push(...arguments);
        } else {
            return args.reduce((x, y) => x + y);
        }
    }
})()

curry1(123, 123, 456)
curry1(1, 2);
console.log(curry1());

curry1(1, 2);
console.log(curry1());



let curry2 = function (func) {
    let args = [].slice.call(arguments, 1);
    return function adda() {
        if (!!arguments.length) {
            args.push(...arguments);
            return adda;
        } else {
            return func.apply(this, args);
        }
    }
}

function add() {
    return [].reduce.call(arguments, (x, y) => x + y);
}
let a = curry2(add,1,2);
console.log(a());
a(5,6,7);
console.log(a());
console.log(curry2(add, 1, 2, 3)(45, 5)(4)());

console.log(curry2(add, 55)());



'use strict';

function plus() {
    let _args = [];
    let adder = ()=> {
        console.log(_args);
        _args.push(...arguments);
        return adder;
    }
    return adder;
}
plus(1)(4)(2)(3); // [] [1] [1,1]


