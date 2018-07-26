package exercise.util.json;

import javax.json.Json;
import javax.json.JsonValue;
import java.util.Arrays;
import java.util.stream.Collectors;
import javax.json.bind.adapter.JsonbAdapter;

public class CardCordAdapter implements JsonbAdapter<String, JsonValue> {
    @Override
    public JsonValue adaptToJson(String code) {
        var secret = Arrays.stream(new String[code.length()])
            .map(c -> "*")
            .collect(Collectors.joining());
        return Json.createValue(secret);
    }

    @Override
    public String adaptFromJson(JsonValue jsonValue) {
        return jsonValue.toString();
    }
}
