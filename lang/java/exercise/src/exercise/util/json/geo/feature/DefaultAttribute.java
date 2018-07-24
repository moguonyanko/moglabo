package exercise.util.json.geo.feature;

import exercise.util.json.geo.Attribute;

public class DefaultAttribute<T> implements Attribute<T> {

    private final String key;

    private final T value;

    public DefaultAttribute(String key, T value) {
        this.key = key;
        this.value = value;
    }

    @Override
    public String getKey() {
        return key;
    }

    @Override
    public T getValue() {
        return value;
    }
}
