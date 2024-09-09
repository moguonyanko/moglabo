const expect = @import("std").testing.expect;

fn fibonacci(n: u32) u32 {
    if (n == 0 or n == 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
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
