package exercise.util.json.geo.feature;

import java.util.*;
import java.awt.geom.PathIterator;

import exercise.util.json.geo.Geometry;
import exercise.util.json.geo.GeometryType;

public class PointGeometry implements Geometry {

    // staticにするとJSONに出力されない。
    private final GeometryType type = GeometryType.POINT;

    private final List<Double> coordinates;

    public PointGeometry(List<Double> coordinates) {
        this.coordinates = coordinates;
    }

    @Override
    public GeometryType getType() {
        return type;
    }

    // nullを返しているのでデフォルトではJSONへのシリアライズにおいて無視される。
    @Override
    public PathIterator getPathIterator() {
        return null;
    }

    @Override
    public List<Double> getCoordinates() {
        return List.copyOf(coordinates);
    }
}
