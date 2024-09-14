const expect = @import("std").testing.expect;

test "ループの各値を取得できる" {
    const x = [_]u8{ 1, 10, 100, 127, 255 };
    for (x) |v| try expect(@TypeOf(v) == u8);
}
