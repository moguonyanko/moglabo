const std = @import("std");

pub fn main() void {
    std.debug.print("こんにちは, {s}!\n", .{"Zig World!"});
}
