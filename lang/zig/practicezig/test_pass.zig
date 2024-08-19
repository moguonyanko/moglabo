const std = @import("std");
const expect = std.testing.expect;

test "常にパスするテスト" {
    try expect(true);
}
