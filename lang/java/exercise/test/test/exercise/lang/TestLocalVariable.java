package test.exercise.lang;

import org.junit.Test;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

public class TestLocalVariable {

    @Test
    public void defineLocalVariable() {
        float x = 5.5F;
        double y = 5.5;
        // IDE未対応
        //var y = 5.5;
        assertThat(x, is((float)y));
    }

}
