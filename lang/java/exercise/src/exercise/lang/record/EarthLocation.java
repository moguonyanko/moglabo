package exercise.lang.record;

public record EarthLocation(Double longitude, Double latitude) implements Location {
    
    @Override
    public Double getLongitude() {
        return longitude();
    }

    @Override
    public Double getLatitude() {
        return latitude();
    }
    
    
}
