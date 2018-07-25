package exercise.util.json.geo.feature;

import java.util.*;
import java.awt.geom.PathIterator;

import exercise.util.json.geo.Geometry;
import exercise.util.json.geo.GeometryType;

import javax.json.bind.annotation.JsonbTransient;

public class PointGeometry implements Geometry {

    // staticにするとJSONに出力されない。
    private static final GeometryType geometryType = GeometryType.POINT;

    private final List<Double> coordinates;

    public PointGeometry(List<Double> coordinates) {
        this.coordinates = coordinates;
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
    public List<Double> getCoordinates() {
        return List.copyOf(coordinates);
    }

    // インターフェースのdefaultメソッドを参照してJSONシリアライズは行われることはない。
    // JSONに出力したいプロパティには必ず対応するgetterが必要である。
    // getXXXが返す値の型とXXXの型が一致していなければシリアライズの際に実行時例外が発生する。
    @Override
    public String getType() {
        return Geometry.super.getType();
    }
}
