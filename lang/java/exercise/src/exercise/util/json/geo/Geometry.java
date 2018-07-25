package exercise.util.json.geo;

import javax.json.bind.annotation.JsonbTransient;
import java.util.*;
import java.awt.geom.PathIterator;

public interface Geometry {

    // JsonbTransientアノテーションは実装クラスに継承される。
    @JsonbTransient
    GeometryType getGeometryType();

    default String getType() {
        return getGeometryType().getTypeName();
    }

    PathIterator getPathIterator();

    List<Double> getCoordinates();

}
