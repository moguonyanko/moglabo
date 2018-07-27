package exercise.util.json.geo.feature;

import java.awt.geom.Path2D;
import java.awt.geom.PathIterator;
import java.awt.geom.Point2D;
import java.util.List;
import javax.json.bind.annotation.JsonbProperty;
import javax.json.bind.annotation.JsonbTransient;
import javax.json.bind.annotation.JsonbTypeAdapter;

import exercise.util.json.geo.CoordinatesAdapter;
import exercise.util.json.geo.Geometry;
import exercise.util.json.geo.GeometryType;

public class PolygonGeometry implements Geometry {

    private static final GeometryType geometryType = GeometryType.POLYGON;

    @JsonbTypeAdapter(CoordinatesAdapter.class)
    private final List<Point2D> coordinates;

    public PolygonGeometry(List<Point2D> coordinates) {
        this.coordinates = coordinates;
    }

    @Override
    public GeometryType getGeometryType() {
        return geometryType;
    }

    @Override
    public PathIterator getPathIterator() {
        var path = new Path2D.Double();
        for (int i = 0; i < coordinates.size(); i++) {
            var p = coordinates.get(i);
            if (i == 0) {
                path.moveTo(p.getX(), p.getY());
            } else {
                path.lineTo(p.getX(), p.getY());
            }
        }
        path.closePath();
        return path.getPathIterator(null);
    }

    @Override
    public List<Point2D> getCoordinates() {
        return List.copyOf(coordinates);
    }

    @Override
    public String getType() {
        return Geometry.super.getType();
    }
}
