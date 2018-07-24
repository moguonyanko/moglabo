package exercise.util.json.geo;

import java.util.*;

public interface Properties<T> {

    Iterator<Attribute<T>> getAttributeIterator();

    List<Attribute<T>> getAttributes();

}
