package test.exercise.lang;

import java.util.List;
import java.util.Locale;
import java.util.ResourceBundle;
import java.util.stream.Collectors;
import static java.lang.StackWalker.*;

import org.junit.Test;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

import exercise.localize.ResourceLoader;

/**
 * 参考:
 * http://download.java.net/java/jdk9/docs/api/java/lang/StackWalker.html
 */
public class TestStackWalker {

    @Test
    public void getClassNamesInCurrentStackFrames() {
        List<String> classNames = StackWalker.getInstance().walk(stream ->
                stream.map(StackFrame::getClassName).collect(Collectors.toList()));

        assertFalse(classNames.isEmpty());
    }

    @Test
    public void canLoadResourceBundleByStackWalker() {
        ResourceLoader loader = new ResourceLoader();
        ResourceBundle resourceBundle = loader.getResourceBundle("greeting", Locale.US);
        List<String> result = resourceBundle.keySet().stream()
            .map(key -> key + ":" + resourceBundle.getString(key))
            .collect(Collectors.toList());
        System.out.println(result);
        assertFalse(result.isEmpty());
    }

}
