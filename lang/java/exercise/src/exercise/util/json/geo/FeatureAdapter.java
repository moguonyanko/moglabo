package exercise.util.json.geo;

import java.util.function.BiConsumer;
import java.util.function.BiFunction;
import java.util.function.BinaryOperator;

import javax.json.Json;
import javax.json.JsonArrayBuilder;
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

    // reduce版
    private JsonArrayBuilder getCoordinatesBuilderV0(Geometry geom) {
        BinaryOperator<JsonArrayBuilder> combiner = (acc, ignored) -> acc;
        return geom.getCoordinates().stream()
            .reduce(Json.createArrayBuilder(), JsonArrayBuilder::add,
                (acc, ignored) -> acc);
    }

    // collect版
    // ラムダ式の左辺にはvarを使用することができない。
    private JsonArrayBuilder getCoordinatesBuilder(Geometry geom) {
        return geom.getCoordinates().stream()
            .collect(Json::createArrayBuilder, JsonArrayBuilder::add,
                JsonArrayBuilder::addAll);
    }

    private JsonObjectBuilder getGeometryBuilder(Feature feature) {
        var geom = feature.getGeometry();
        return Json.createObjectBuilder()
            .add("type", geom.getType().getTypeName())
            .add("coordinates", getCoordinatesBuilder(geom));
    }

    // reduce版
    private JsonObjectBuilder getPropertiesBuilderV0(Feature feature) {
        var props = feature.getProperties();
        BiFunction<JsonObjectBuilder, Property, JsonObjectBuilder> accumulator =
            (acc, property) -> {
                var keyValue = property.getKeyValue();
                var builder = Json.createObjectBuilder(keyValue);
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
