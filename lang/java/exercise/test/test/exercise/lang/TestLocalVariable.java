package test.exercise.lang;

import java.util.Arrays;
import java.util.function.BiFunction;
import java.util.stream.Collectors;

import org.junit.Test;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

public class TestLocalVariable {

    @Test
    public void defineLocalVariable() {
        float x = 5.5F;
        var y = 5.5;
        assertThat(x, is((float)y));
    }

    @Test
    public void defineLambdaWithTypeInference() {
        BiFunction<Integer, Integer, Integer> add =
            (x, y) -> x + y;

        int expected = 10;
        int actual = add.apply(3, 7);
        assertThat(actual, is(expected));
    }

    @Test
    public void defineListByLocalVariable() {
        var list = Arrays.asList(1, 2, 3);
        var actual = list.stream().map(i -> i * i).collect(Collectors.toList());
        var expected = Arrays.asList(1, 4, 9);
        assertThat(actual, is(expected));
    }

}
