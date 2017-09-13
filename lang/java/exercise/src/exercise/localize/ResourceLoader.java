package exercise.localize;

import java.util.Locale;
import java.util.ResourceBundle;

/**
 * 参考:
 * http://download.java.net/java/jdk9/docs/api/java/lang/StackWalker.html#getCallerClass--
 */
public class ResourceLoader {

    // staticで宣言しても動作するが何らかのタイミングで問題が発生するのかもしれない。
    private final StackWalker walker =
        StackWalker.getInstance(StackWalker.Option.RETAIN_CLASS_REFERENCE);

    public ResourceBundle getResourceBundle(String bundleName,
                                                   Locale locale) {
        Class<?> caller = walker.getCallerClass();
        ClassLoader loader = caller.getClassLoader();
        ResourceBundle resourceBundle = ResourceBundle.getBundle(bundleName,
            locale, loader);
        return resourceBundle;
    }

    public ResourceBundle getResourceBundle(String bundleName) {
        return getResourceBundle(bundleName, Locale.getDefault());
    }

}
