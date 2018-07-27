package exercise.util.json.geo.feature;

import java.awt.geom.Point2D;
import java.awt.geom.PathIterator;
import java.util.List;
import javax.json.bind.annotation.JsonbTypeAdapter;

import exercise.util.json.geo.CoordinatesAdapter;
import exercise.util.json.geo.Geometry;
import exercise.util.json.geo.GeometryType;

public class PointGeometry implements Geometry {

    // staticにするとJSONに出力されない。
    private static final GeometryType geometryType = GeometryType.POINT;

    @JsonbTypeAdapter(CoordinatesAdapter.class)
    private final List<Point2D> coordinates;

    public PointGeometry(Point2D coordinates) {
        this.coordinates = List.of(coordinates);
    }

    // インターフェースでJsonbTransientアノテーションを指定しているので
    // geometryTypeがstaticでなくてもJSONへのシリアライズで出力されない。
    @Override
    public GeometryType getGeometryType() {
        return geometryType;
    }

    // nullを返しているのでデフォルトではJSONへのシリアライズにおいて無視される。
    @Override
    public PathIterator getPathIterator() {
        return null;
    }

    @Override
    public List<Point2D> getCoordinates() {
        return List.copyOf(coordinates);
    }

    // インターフェースのdefaultメソッドを参照してJSONシリアライズが行われることはない。
    // JSONに出力したいプロパティには必ず対応するgetterが必要である。
    // getXXXが返す値の型とXXXの型が一致していなければシリアライズの際に実行時例外が発生する。
    @Override
    public String getType() {
        return Geometry.super.getType();
    }
}
