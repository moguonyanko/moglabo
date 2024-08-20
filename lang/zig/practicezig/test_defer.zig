const expect = @import("std").testing.expect;

test "defer" {
    // i16のような整数型に対して除算を行うとエラーになるのでf32で宣言する。
    var x: f32 = 100;
    {
        defer x *= 3;
        defer x /= 2;
    }
    // deferは後に書かれたものから評価されるので4.5となる。
    try expect(x == 150);
}
