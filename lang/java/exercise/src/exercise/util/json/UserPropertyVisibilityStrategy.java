package exercise.util.json;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import javax.json.bind.config.PropertyVisibilityStrategy;

public class UserPropertyVisibilityStrategy implements PropertyVisibilityStrategy {

    @Override
    public boolean isVisible(Field field) {
        return !field.getName().startsWith("secret");
    }

    @Override
    public boolean isVisible(Method method) {
        return !method.getName().contains("Secret");
    }
}
