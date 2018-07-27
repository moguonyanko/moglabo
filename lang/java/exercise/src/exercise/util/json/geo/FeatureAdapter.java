package exercise.util.json.geo;

import java.util.function.BiConsumer;
import java.util.function.BiFunction;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.bind.adapter.JsonbAdapter;

/**
 * 参考:
 * https://github.com/eugenp/tutorials/blob/master/jsonb/src/main/java/com/baeldung/adapter/PersonAdapter.java
 *
 * アダプターにPropertyOrderStrategyを指定しても効果無し。
 *
 * TODO:
 * JsonbConfig.withAdaptersで登録しても利用されていない。
 */
public class FeatureAdapter implements JsonbAdapter<Feature, JsonObject> {

    private JsonObjectBuilder getGeometryBuilder(Feature feature) {
        var geom = feature.getGeometry();
        var arrayBuilder = Json.createArrayBuilder();
        var coordinates = geom.getCoordinates();

        if (geom.getGeometryType() == GeometryType.POINT) {
            var p = coordinates.get(0);
            arrayBuilder.add(p.getX()).add(p.getY());
        } else {
            for (int i = 0; i < coordinates.size(); i++) {
                var subArray = Json.createArrayBuilder();
                var p = coordinates.get(i);
                subArray.add(p.getX()).add(p.getY());
                arrayBuilder.add(subArray);
            }
        }

        return Json.createObjectBuilder()
            .add("type", geom.getType())
            .add("coordinates", arrayBuilder);
    }

    // reduce版
    private JsonObjectBuilder getPropertiesBuilderV0(Feature feature) {
        var props = feature.getProperties();
        BiFunction<JsonObjectBuilder, Property, JsonObjectBuilder> accumulator =
            (acc, property) -> {
                var builder = Json.createObjectBuilder(property.getKeyValue());
                return acc.addAll(builder);
            };
        return (JsonObjectBuilder)props.toList().stream()
            .reduce(Json.createObjectBuilder(), accumulator, (acc, ignored) -> acc);
    }

    // collect版
    // 以下のコードではattrsがObjectのCollectionだと見なされてしまう。
    //var attrs = props.getAttributes();
    // またIterator<Attribute>ではなくvarと書いてしまうと
    // next()の戻り値の型がObjectになってしまう。(Iterator<Object>になる)
    //var iterator = props.getAttributeIterator();
    private JsonObjectBuilder getPropertiesBuilder(Feature feature) {
        BiConsumer<JsonObjectBuilder, Property> consumer =
            (acc, property) -> {
                var kv = Json.createObjectBuilder(property.getKeyValue());
                acc.addAll(kv);
            };

        // TODO:
        //JsonObjectBuilderにキャストしなければならない理由が不明である。
        return (JsonObjectBuilder)feature.getProperties().toList().stream()
            .collect(Json::createObjectBuilder, consumer, consumer);
    }

    // 以下のようなコードで安易に配列や数値のプロパティを文字列にしてはいけない。
    // 適切な型の値に注意深くパースすることをクライアント側に強いることになる。
    //Json.createObjectBuilder().add("numbers", Arrays.toString(geom.getNumbers()))
    @Override
    public JsonObject adaptToJson(Feature feature) {
        var geomJson = getGeometryBuilder(feature).build();
        var propsJson = getPropertiesBuilder(feature).build();

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
