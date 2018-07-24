package exercise.util.json.geo.feature;

import java.awt.geom.PathIterator;

import exercise.util.json.geo.Geometry;
import exercise.util.json.geo.GeometryType;

public class PointGeometry implements Geometry {

    // staticにするとJSONに出力されない。
    private final GeometryType type = GeometryType.POINT;

    private final double[] coordinates;

    public PointGeometry(double[] coordinates) {
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
    public double[] getCoordinates() {
        return coordinates;
    }
}
