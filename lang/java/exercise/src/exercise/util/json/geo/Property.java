package exercise.util.json.geo;

import java.util.*;

public interface Property<T> {

    String getKey();

    T getValue();

    default Map<String, T> getKeyValue() {
        return Map.of(getKey(), getValue());
    }

}
