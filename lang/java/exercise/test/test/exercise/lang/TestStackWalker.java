package test.exercise.lang;

import java.util.List;
import java.util.stream.Collectors;
import static java.lang.StackWalker.*;

import org.junit.Test;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

/**
 * 参考:
 * http://download.java.net/java/jdk9/docs/api/java/lang/StackWalker.html
 */
public class TestStackWalker {

    // TODO: thrown IllegalStateException
    @Test
    public void getClassNamesInCurrentStackFrames() {
        List<String> classNames = StackWalker.getInstance()
            .walk(
                stream -> stream.map(StackFrame::getClassName)
            ).collect(Collectors.toList());

        classNames.forEach(System.out::println);
    }

}
