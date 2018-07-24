package exercise.util.json.geo;

public enum FeatureType {
    FEATURE("Feature"), FEATURECOLLECTION("FeatureCollection");

    private final String typeName;

    FeatureType(String typeName) {
        this.typeName = typeName;
    }

    public String getTypeName() {
        return typeName;
    }
}
