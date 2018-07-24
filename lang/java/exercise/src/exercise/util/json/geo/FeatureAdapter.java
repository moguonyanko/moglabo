package exercise.util.json.geo;

import java.util.*;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.bind.adapter.JsonbAdapter;
import javax.json.bind.annotation.JsonbPropertyOrder;
import javax.json.bind.config.PropertyOrderStrategy;

/**
 * 参考:
 * https://github.com/eugenp/tutorials/blob/master/jsonb/src/main/java/com/baeldung/adapter/PersonAdapter.java
 *
 * アダプターにPropertyOrderStrategyを指定しても効果無し。
 *
 * TODO:
 * JsonbConfig.withAdaptersで登録しても利用されていない。
 */
@JsonbPropertyOrder(PropertyOrderStrategy.REVERSE)
public class FeatureAdapter implements JsonbAdapter<Feature, JsonObject> {

    @Override
    public JsonObject adaptToJson(Feature feature) {
        var geom = feature.getGeometry();
        var props = feature.getProperties();

        var geomJson = Json.createObjectBuilder()
            .add("type", geom.getType().getTypeName())
            .add("coordinates", geom.getCoordinates().toString())
            .build();

        List<Attribute> attrs = props.getAttributes();
        // 以下のコードではattrsがObjectのCollectionだと見なされてしまう。
        //var attrs = props.getAttributes();

        // 参考:
        // Iterator<Attribute>ではなくvarと書いてしまうと
        // next()の戻り値の型がObjectになってしまう。(Iterator<Object>になる)
        //var iterator = props.getAttributeIterator();

        var propsJsonBuilder = Json.createObjectBuilder();
        for (int i = 0; i < attrs.size(); i++) {
            var attr = attrs.get(i);
            var entry = attr.getEntry();
            propsJsonBuilder = propsJsonBuilder.add(entry[0], entry[1]);
        }
//        attrs.stream()
//            .map(Attribute::getEntry)
//            .forEach(entry -> {
//                propsJsonBuilder.add(entry[0], entry[1]);
//            });

        var propsJson = propsJsonBuilder.build();

        return Json.createObjectBuilder()
            .add("type", feature.getType().getTypeName())
            .add("geometry", geomJson)
            .add("properties", propsJson)
            .build();
    }

    @Override
    public Feature adaptFromJson(JsonObject jsonObject) {
        throw new UnsupportedOperationException("Not implement yet");
    }
}
