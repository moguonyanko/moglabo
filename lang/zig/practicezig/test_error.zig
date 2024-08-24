const expect = @import("std").testing.expect;

const FileOpenError = error{
    AccessDenied,
    OutOfMemory,
    FileNotFound,
};

const AllocationError = error{OutOfMemory};

test "サブセットのエラーをスーパーセットのエラーの型として割り当てる" {
    const err: FileOpenError = AllocationError.OutOfMemory;
    try expect(err == FileOpenError.OutOfMemory);
}

fn failingFunction() error{Oops}!void {
    return error.Oops;
}

test "必ずエラーが返される関数を呼び出す" {
    failingFunction() catch |err| {
        try expect(err == error.Oops); // 返されたエラーの型をチェック
        return;
    };
}

var errcode: i32 = 0;

fn failFnCounter() error{Oops}!void {
    errdefer errcode = -1; // u32型には-1は設定できない。
    try failingFunction();
}

test "errdeferはエラー発生時だけ遅延して評価される" {
    failFnCounter() catch |err| {
        try expect(err == error.Oops);
        try expect(errcode == -1);
        return;
    };
}
