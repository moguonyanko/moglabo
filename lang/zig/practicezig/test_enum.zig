const expect = @import("std").testing.expect;

// 各列挙子には数値が0から割り当てられている。
const Value = enum(u2) { zero, one, two };

test "列挙子に最初から設定されている値を参照できる" {
    try expect(@intFromEnum(Value.zero) == 0);
    try expect(@intFromEnum(Value.one) == 1);
    try expect(@intFromEnum(Value.two) == 2);
}

const Value2 = enum(i32) {
    num1 = -100,
    num2 = 100,
    num3 = 1000000,
    next, // 何も割り当てなければ前の値の次の値になる。
};

test "列挙子に割り当てた数値が参照できる" {
    try expect(@intFromEnum(Value2.num1) == -100);
    try expect(@intFromEnum(Value2.num2) == 100);
    try expect(@intFromEnum(Value2.num3) == 1000000);
    try expect(@intFromEnum(Value2.next) == 1000000 + 1);
}

const Mode = enum(u32) {
    var count: u32 = 0; // 状態を持てる。
    special = 5,
    basic = 1,
    pub fn isBasic(self: Mode) bool {
        // TODO: self.countはエラーになる。
        // if (Mode.special < self.count) {
        //     return false;
        // }
        return self == Mode.special;
    }
};

test "列挙子の状態を変更しメソッドを呼び出せる" {
    Mode.count += 6;
    try expect(Mode.basic.isBasic() == Mode.isBasic(.basic));
    try expect(Mode.count == 6);
}
