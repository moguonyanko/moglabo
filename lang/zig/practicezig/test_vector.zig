const expect = @import("std").testing.expect;
const meta = @import("std").meta;

test "ベクトルにスカラーを積算できる" {
    const vector: @Vector(3, i8) = .{ 2, 3, 7 };
    // @asに@Vectorと@splatを適用することで全て同じ値のベクトルつまりスカラーを作る。
    const sclar = vector * @as(@Vector(3, i8), @splat(5));
    try expect(meta.eql(sclar, @Vector(3, i8){ 10, 15, 35 }));
}

test "ベクトルのイテレートができる" {
    const len: i8 = 4;
    // [len]i8で型を明示しない場合comptime_intになる。
    const vector: [len]i8 = @Vector(len, i8){ -127, 0, 127, 0 };
    const sum: i8 = blk: {
        var tmp: i8 = 0;
        // インデックスはunsiginedな型でないとエラーになる。
        // Pythonのようにインデックスに負の値は指定できないということ。
        var i: u8 = 0;
        while (i < len) : (i += 1) tmp += vector[i];
        break :blk tmp;
    };
    try expect(sum == 0);
    // Vector生成時にサイズを指定するがlenなどVectorのサイズを得られるプロパティはないようだ。
    //try expect(vector.len == len);
}
