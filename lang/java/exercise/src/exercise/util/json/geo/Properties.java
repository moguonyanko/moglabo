package exercise.util.json.geo;

import java.util.*;

public interface Properties<T> {

    Iterator<Property<T>> getAttributeIterator();

    List<Property<T>> toList();

}
