package exercise.util.json.geo;

import javax.json.bind.annotation.JsonbPropertyOrder;
import javax.json.bind.config.PropertyOrderStrategy;

/**
 * 参考:
 * https://tools.ietf.org/html/rfc7946
 */
public interface Feature {

    FeatureType getType();

    Geometry getGeometry();

    Properties getProperties();

}
