const expect = @import("std").testing.expect;

// 普通に呼び出すと引数nが35程度でとても遅くなる関数
fn fibonacci(n: u32) u32 {
    if (n == 0 or n == 1) {
        return n;
    } else {
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}

test "comptimeで実行時間を短縮できる" {
    const num: u32 = 35;
    const expected: u32 = 9227465;
    const x = comptime fibonacci(num);
    const y = comptime blk: {
        break :blk fibonacci(num);
    };
    try expect(y == expected);
    try expect(x == expected);
}

test "コンパイル時にリテラルは型を強制される" {
    const a = 11; // コンパイル時に値が収まる型を強制される。
    // コンパイル時に条件を満たす型を割り当てることができる。
    const b: if (a < 10) f32 else i32 = 5;
    try expect(b == 5);
    try expect(@TypeOf(b) == i32);
}

fn Rect(
    comptime T: type,
    comptime width: comptime_int,
    comptime height: comptime_int,
) type {
    return [width][height]T;
}

test "型を返すことができる" {
    const width = 120;
    const height = 360;
    const rect = Rect(u16, width, height);
    try expect(rect == [width][height]u16);
}
