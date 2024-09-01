const expect = @import("std").testing.expect;

const Stuff = struct {
    // xとyは型が揃っていないとエラーになる。
    x: i32,
    y: i32,
    z: i32 = 0,

    fn swap(self: *Stuff) void {
        const tmp = self.x;
        self.x = self.y;
        self.y = tmp;
    }

    fn swap_immutable(self: Stuff) Stuff {
        return Stuff{ .x = self.y, .y = self.x };
    }
};

test "構造体の関数を呼び出せる" {
    // zはデフォルト値を使う。
    const src = Stuff{ .x = 10, .y = 20 };
    // src.swap_immutable()でも呼び出せてしまう。構造体の名前経由でしか呼び出せないようにはできないのか？
    const dist = Stuff.swap_immutable(src);
    try expect(dist.x == 20);
    try expect(dist.y == 10);
    try expect(dist.z == 0);
}
