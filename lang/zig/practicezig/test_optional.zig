const expect = @import("std").testing.expect;

test "orelse式で値を得られる" {
    const a: ?f32 = 5.5;
    const b = a orelse unreachable;
    const c = a.?; // ドットを介してプロパティを参照しているわけではない。
    try expect(b == c);
    try expect(@TypeOf(c) == f32);
}

var numbers_left: u32 = 0;
const limit: u32 = 10;
fn eventuallyNullSequence() ?u32 {
    if (numbers_left == limit) {
        return null;
    }
    numbers_left += 1;
    return numbers_left;
}

test "nullを返すループで計算できる" {
    var sum: u32 = 0;
    // nullが返されたら自動的にループを抜ける。
    while (eventuallyNullSequence()) |value| {
        sum += value;
    }
    try expect(sum == 55);
}

test "Optionalな値を取得できる" {
    const a: ?i32 = 5;
    if (a != null) {
        const value = a.?;
        _ = value;
    }
    try expect(a.? == 5);

    // 上と書き方が変わっただけ。.?を介さずに値が取得できている。
    var b: ?i32 = 5;
    if (b) |*value| {
        value.* *= 2;
    }
    try expect(b.? == 10);
}
