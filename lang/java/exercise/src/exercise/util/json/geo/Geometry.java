package exercise.util.json.geo;

import java.awt.geom.Point2D;
import java.awt.geom.PathIterator;
import java.util.List;
import javax.json.bind.annotation.JsonbTransient;

public interface Geometry {

    // JsonbTransientアノテーションは実装クラスに継承される。
    @JsonbTransient
    GeometryType getGeometryType();

    // JsonbPropertyアノテーションは継承されない。
    // インターフェースに指定しても実装クラスでは無視される。
    // @JsonbProperty("type")
    default String getType() {
        return getGeometryType().getTypeName();
    }

    @JsonbTransient
    PathIterator getPathIterator();

    List<Point2D> getCoordinates();

}
