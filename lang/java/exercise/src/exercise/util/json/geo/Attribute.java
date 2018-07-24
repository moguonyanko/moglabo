package exercise.util.json.geo;

public interface Attribute<T> {

    String getKey();

    T getValue();

    default String[] getEntry() {
        return new String[]{getKey(), getValue().toString()};
    }

}
