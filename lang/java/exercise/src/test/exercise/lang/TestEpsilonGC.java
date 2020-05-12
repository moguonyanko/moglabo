package test.exercise.lang;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

/**
 * 参考:
 * https://blogs.oracle.com/otnjp/epsilon-the-jdks-do-nothing-garbage-collector-ja
 */

public class TestEpsilonGC {

    @Test
    public void allocateTooLargeMemory() {
        var gigabyte = 1024 * 1024 * 1024;
        var iterations = 100;

        System.out.println("メモリ割り当て開始");

        // 一度に1GBのメモリを割当てる
        // EpsilonGCが有効な場合は短い時間でOutOfMemoryErrorが発生し
        // プログラムの実行がそこで中断される。
        for (int i = 0; i < iterations; i++) {
            var array = new byte[gigabyte];
        }

        fail("Epsilon無効");
    }

}
