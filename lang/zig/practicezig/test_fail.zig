const std = @import("std");
const expect = std.testing.expect;

test "いつも失敗するテスト" {
    try expect(false);
}
