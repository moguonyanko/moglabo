package exercise.util.json.geo;

/**
 * 参考:
 * https://tools.ietf.org/html/rfc7946
 */
public interface Feature {

    FeatureType getType();

    Geometry getGeometry();

    Properties getProperties();

}
