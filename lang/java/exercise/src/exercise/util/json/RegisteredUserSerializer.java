package exercise.util.json;

import javax.json.bind.serializer.JsonbSerializer;
import javax.json.bind.serializer.SerializationContext;
import javax.json.stream.JsonGenerator;

public class RegisteredUserSerializer implements JsonbSerializer<RegisteredUser> {

    @Override
    public void serialize(RegisteredUser user, JsonGenerator jsonGenerator,
                          SerializationContext serializationContext) {
        jsonGenerator.writeStartObject();
        jsonGenerator.write("code", user.getCode());
        jsonGenerator.write("name", user.getName());
        var tmp = user.getName().split("\\s");
        String initialName;
        if (tmp.length == 2) {
            initialName = tmp[1].charAt(0) + "." + tmp[0].charAt(0);
        } else {
            initialName = "";
        }
        jsonGenerator.write("initialName", initialName);
        jsonGenerator.writeEnd();
    }
}
