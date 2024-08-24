test "配列の範囲外を参照してエラーになる" {
    const a = [3]u8{ 1, 2, 3 };
    var out_of_index: u8 = 10; // 負の値を配列のインデックスには指定できずエラーになる。
    const b = a[out_of_index];
    _ = b;
    _ = &out_of_index;
}
