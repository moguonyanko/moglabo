package test.exercise.stream;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

import exercise.stream.StreamUtil;

/**
 * 参考:
 * http://www.journaldev.com/13204/javase9-stream-api-improvements
 */
public class TestStream {

    @Test
    public void getResultBySum() {
        Integer[] src = new Integer[]{1, 2, 3, 4, 5};
        List<Integer> sample = Arrays.asList(src);

        int actual = StreamUtil.sum(sample);
        int expected = 15;

        assertThat(actual, is(expected));
    }

    @Test
    public void canGetResultByTakeWhileWithOrderedStream() {
        List<Integer> source = List.of(1, 2, 3, 4, 5, 6, 7);
        // takeWhileは条件を満たすまで要素を取得し続ける。
        List<Integer> actual = StreamUtil.take(source, i -> i < 4, ArrayList::new);
        List<Integer> expected = List.of(1, 2, 3);
        assertThat(actual, is(expected));
    }

    @Test
    public void canGetResultByTakeWhileWithUnorderedStream() {
        List<Integer> source = List.of(1, 2, 4, 3, 5, 6, 7);
        List<Integer> actual = StreamUtil.take(source, i -> i < 4, ArrayList::new);
        // 条件を満たさなくなった時点でストリームに対する処理は打ち切られる。
        List<Integer> expected = List.of(1, 2);
        assertThat(actual, is(expected));
    }

    @Test
    public void canGetResultByDropWhileWithOrderedStream() {
        List<Integer> source = List.of(1, 2, 3, 4, 5, 6, 7);
        // dropWhileは条件を満たすまで要素を捨て続ける。
        List<Integer> actual = StreamUtil.drop(source, i -> i < 4, ArrayList::new);
        List<Integer> expected = List.of(4, 5, 6, 7);
        assertThat(actual, is(expected));
    }

    @Test
    public void canGetResultByDropWhileWithUnorderedStream() {
        List<Integer> source = List.of(1, 2, 4, 3, 5, 6, 7);
        // 一度条件を満たさなくなったらその後に現れる要素は一切捨てられない。
        List<Integer> actual = StreamUtil.drop(source, i -> i < 4, ArrayList::new);
        List<Integer> expected = List.of(4, 3, 5, 6, 7);
        assertThat(actual, is(expected));
    }

    @Test
    public void iterateOfStream() {
        int expected = 15;
        // 第1引数が第2引数を満たす場合，第3引数を適用して再び第2引数を満たすかチェックされる。
        // 第2引数の述語は『現在の値がストリームの終端であるかどうか』を判定する。
        // 第1引数を0にすると以下のストリームの処理は無限ループする。0 * 2 = 0が繰り返されるため。
        // 5回目のiterateでは8 * 2 = 16で第2引数を満たさなくなりストリームの処理は終了される。
        int actual = IntStream.iterate(1, i -> i <= 10, i -> i * 2)
            .peek(System.out::println)
            .sum();
        assertThat(actual, is(expected));
    }

    @Test
    public void iterateOfStreamWithFilter() {
        int expected = 15;
        // limitが無いと永遠にストリームの処理が継続されてしまう。
        int actual = IntStream.iterate(1, i -> i * 2)
            .limit(5)
            .filter(i -> i <= 10)
            .sum();
        assertThat(actual, is(expected));
    }

    @Test
    public void makeNullableStream() {
        String expected = "";

        String actual = Stream.ofNullable(null)
            .takeWhile(Objects::isNull)
            // NullPointerExceptionはスローされない。
            // ofNullableにより空のストリームが生成されているからである。
            .map(Object::toString)
            .collect(Collectors.joining(""));

        assertThat(actual, is(expected));
    }
}
