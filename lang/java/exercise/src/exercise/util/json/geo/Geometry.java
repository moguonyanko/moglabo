package exercise.util.json.geo;

import java.awt.geom.PathIterator;

public interface Geometry {

    GeometryType getType();

    PathIterator getPathIterator();

    double[] getCoordinates();

}
