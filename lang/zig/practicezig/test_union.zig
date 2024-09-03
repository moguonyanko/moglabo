const expect = @import("std").testing.expect;

const SampleData = union {
    int: i64,
    float: f64,
    bool: bool,
};

test "Unionのフィールドを更新できる" {
    // フィールドは一つしか初期化で指定できない。
    var sample = SampleData{ .int = 99 };
    // 以下はエラー。
    // var sample = SampleData{ .int = 99, .float = 1.11 };

    // 初期化で指定したフィールドしか更新できない。
    sample.int = 10;
    // 以下はエラー。
    // sample.float = 12.34;

    try expect(sample.int == 10);
}

const Tagged = union(enum) { a: u8, b: f32, c: bool };

test "タグ付きUnionでswitch文の処理が行える" {
    var value = Tagged{ .b = 0.5 };
    switch (value) {
        .a => |*byte| byte.* += 1,
        .b => |*float| float.* *= 10,
        .c => |*b| b.* = !b.*,
    }
    // b以外に触るとエラー
    // try expect(value.a == 1);
    try expect(value.b == 5);
    // try expect(value.c == false);
}
