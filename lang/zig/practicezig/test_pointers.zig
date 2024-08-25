const expect = @import("std").testing.expect;

fn square(num: *u32) void {
    //    num.* = num * num; // ポインタ同士を掛け合わせることはできない。
    num.* = num.* * num.*;
}

test "multiple pointers" {
    var x: u32 = 2; // constで宣言するとエラーになり変更できない。
    square(&x);
    try expect(x == 4);
}
