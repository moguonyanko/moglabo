package exercise.util.json;

import java.lang.reflect.Type;
import javax.json.bind.serializer.DeserializationContext;
import javax.json.bind.serializer.JsonbDeserializer;
import javax.json.stream.JsonParser;

// 型パラメータに指定する型の名前が誤っているとデシリアライズ時に利用されない。
public class RegisteredUserDeserializer implements JsonbDeserializer<RegisteredUser> {

    @Override
    public RegisteredUser deserialize(JsonParser jsonParser,
                                      DeserializationContext deserializationContext,
                                      Type type) {
        var code = 0L;
        var initialName = "";
        while (jsonParser.hasNext()) {
            var event = jsonParser.next();
            if (event == JsonParser.Event.KEY_NAME) {
                var keyName = jsonParser.getString();
                // プロパティ値を読むためにもう一度nextを呼び出す。
                jsonParser.next();
                // nameをデシリアライズしない仕様に変更されたと仮定する。
                if (keyName.equalsIgnoreCase("code")) {
                    code = jsonParser.getLong();
                    // TODO: serializeやdeserializeを呼び出しても例外になる。
                    //return deserializationContext.deserialize(RegisteredUser.class, jsonParser);
                } else if (keyName.equalsIgnoreCase("initialName")) {
                    initialName = jsonParser.getString();
                }
            }
        }
        return new RegisteredUser(code, "", initialName);
    }

}
