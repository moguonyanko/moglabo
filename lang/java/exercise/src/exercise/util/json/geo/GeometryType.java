package exercise.util.json.geo;

public enum GeometryType {
    POINT("Point"), LINESTRING("LineString"), POLYGON("Polygon");

    private final String typeName;

    GeometryType(String typeName) {
        this.typeName = typeName;
    }

    public String getTypeName() {
        return typeName;
    }
}
