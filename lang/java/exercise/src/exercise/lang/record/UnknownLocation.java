package exercise.lang.record;

public record UnknownLocation() implements Location {

    @Override
    public Double getLongitude() {
        return null; // 結局nullを返す羽目になってしまう。
    }

    @Override
    public Double getLatitude() {
        return null;
    }
    
}
