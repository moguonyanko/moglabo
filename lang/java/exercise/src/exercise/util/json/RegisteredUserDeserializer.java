package exercise.util.json;

import java.lang.reflect.Type;
import javax.json.bind.serializer.DeserializationContext;
import javax.json.bind.serializer.JsonbDeserializer;
import javax.json.stream.JsonParser;

public class RegisteredUserDeserializer implements JsonbDeserializer<String> {

    @Override
    public String deserialize(JsonParser jsonParser,
                              DeserializationContext deserializationContext,
                              Type type) {
        while (jsonParser.hasNext()) {
            JsonParser.Event event = jsonParser.next();
            if (event == JsonParser.Event.KEY_NAME) {
                var keyName = jsonParser.getString();
                // nameをデシリアライズしない仕様に変更されたと仮定する。
                if (!keyName.equalsIgnoreCase("name")) {
                    return deserializationContext.deserialize(String.class, jsonParser);
                }
            }
        }
        return "";
    }

}
