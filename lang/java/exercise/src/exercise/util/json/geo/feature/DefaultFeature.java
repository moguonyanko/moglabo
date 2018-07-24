package exercise.util.json.geo.feature;

import exercise.util.json.geo.Feature;
import exercise.util.json.geo.FeatureType;
import exercise.util.json.geo.Geometry;
import exercise.util.json.geo.Properties;

public class DefaultFeature implements Feature {

    // staticフィールドはgetterが記述されていてもJSONへのシリアライズの対象外となる。
    private final FeatureType type = FeatureType.FEATURE;

    private final Geometry geometry;

    private final Properties properties;

    public DefaultFeature(Geometry geometry, Properties properties) {
        this.geometry = geometry;
        this.properties = properties;
    }

    @Override
    public FeatureType getType() {
        return type;
    }

    @Override
    public Geometry getGeometry() {
        return geometry;
    }

    @Override
    public Properties getProperties() {
        return properties;
    }
}
