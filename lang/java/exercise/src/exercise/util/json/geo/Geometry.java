package exercise.util.json.geo;

import java.util.*;
import java.awt.geom.PathIterator;

public interface Geometry {

    GeometryType getType();

    PathIterator getPathIterator();

    List<Double> getCoordinates();

}
