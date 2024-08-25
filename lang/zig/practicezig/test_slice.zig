const expect = @import("std").testing.expect;

fn sum(values: []const u8) usize {
    var current: usize = 0; // 関数名と衝突する名前だとエラーになる。
    for (values) |v| current += v;
    return current;
}

test "total slices" {
    const array = [_]u8{ 2, 3, 5, 7, 11 };
    const slice = array[0..3];
    try expect(sum(slice) == 10);
}

test "check type slices" {
    const array = [_]u8{ 1, 2, 3, 4, 5 };
    const slice = array[0..4];
    // 配列のサイズも型情報に含まれる。[]u8ではテストに失敗する。
    // [?]u8や[_]u8はそもそもエラーになり書けない。
    try expect(@TypeOf(slice) == *const [4]u8);
}
