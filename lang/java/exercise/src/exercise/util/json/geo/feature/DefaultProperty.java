package exercise.util.json.geo.feature;

import exercise.util.json.geo.Property;

public class DefaultProperty<T> implements Property<T> {

    private final String key;

    private final T value;

    public DefaultProperty(String key, T value) {
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
