package exercise.util.json.geo;

import java.awt.geom.Point2D;
import java.util.List;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.bind.adapter.JsonbAdapter;

public class CoordinatesAdapter implements JsonbAdapter<List<Point2D>, JsonArray> {

    @Override
    public JsonArray adaptToJson(List<Point2D> coordinates) {
        var arrayBuilder = Json.createArrayBuilder();
        if (coordinates.size() == 1) {
            var point = coordinates.get(0);
            arrayBuilder.add(point.getX()).add(point.getY());
        } else {
            for (int i = 0; i < coordinates.size(); i++) {
                var subArray = Json.createArrayBuilder();
                var p = coordinates.get(i);
                subArray.add(p.getX()).add(p.getY());
                arrayBuilder.add(subArray);
            }
        }
        return arrayBuilder.build();
    }

    @Override
    public List<Point2D> adaptFromJson(JsonArray jsonArray) {
        throw new UnsupportedOperationException("Not implemented");
    }
}
