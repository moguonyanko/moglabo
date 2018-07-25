package test.exercise.util.json;

import java.time.LocalDate;
import java.util.Arrays;
import javax.json.bind.JsonbBuilder;
import javax.json.bind.JsonbConfig;
import javax.json.bind.config.BinaryDataStrategy;
import javax.json.bind.config.PropertyOrderStrategy;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

import exercise.util.json.*;
import exercise.util.json.geo.*;
import exercise.util.json.geo.feature.*;

/**
 * JSON-P(javax.json, javax.json.api)のjarはバージョン1.1以上であることが必須である。
 *
 * 参考:
 * https://www.ibm.com/developerworks/library/j-javaee8-json-binding-1/index.html
 * https://www.ibm.com/developerworks/library/j-javaee8-json-binding-2/index.html
 * https://www.ibm.com/developerworks/library/j-javaee8-json-binding-3/index.html
 * https://www.ibm.com/developerworks/library/j-javaee8-json-binding-4/index.html
 * https://www.ibm.com/developerworks/jp/java/library/j-whats-new-in-javaee-8/index.html
 * http://www.baeldung.com/java-json-binding-api
 */
public class TestJson {

    private static int studentId = 1;
    private static String studentName = "Taro";
    private static int studentAge = 19;

    private String getStudentJson() {
        var json = new StringBuilder();
        json.append("{\"age\":").append(studentAge);
        json.append(",\"id\":").append(studentId);
        json.append(",\"name\":\"").append(studentName).append("\"}");
        return json.toString();
    }

    private Student getStudent() {
        return new Student(studentId, studentName, studentAge);
    }

    // シリアライズ(Java Object -> JSON)
    @Test
    public void convertToJson() {
        var student = getStudent();
        // デフォルトでは生成されるJSONのプロパティはアルファベット順で並んでいる。
        var actual = JsonbBuilder.create().toJson(student);
        var expected = getStudentJson();
        assertThat(actual, is(expected));
    }

    // デシリアライズ(JSON -> Java Object)
    @Test
    public void convertFromJson() {
        var actual = JsonbBuilder.create()
            .fromJson(getStudentJson(), Student.class);
        var expected = getStudent();
        assertThat(actual, is(expected));
    }

    @Test
    public void customizePropertyName() {
        var ship = new Ship("A001", "My First Ship");
        var actual = JsonbBuilder.create().toJson(ship);
        assertTrue(actual.contains("shipName"));
    }

    @Test
    public void customizeRuntimeConfig() {
        var car = new Car("My Car");

        var config = new JsonbConfig()
            // プロパティの並び順をアルファベット順の逆にしている。
            .withPropertyOrderStrategy(PropertyOrderStrategy.REVERSE)
            // falseにするとnullのプロパティはJSONから除外される。
            // JsonbPropertyアノテーションでnillableが指定されていた場合は
            // そちらの設定が優先される。
            .withNullValues(true);

        var jsonb = JsonbBuilder.create(config);

        var actual = jsonb.toJson(car);
        String expected = "{\"driverName\":null,\"carName\":\"My Car\"}";
        assertThat(actual, is(expected));
    }

    @Test
    public void includeNullPropertyByAnnotation() {
        var car = new Car2("My New Car");
        var actual = JsonbBuilder.create().toJson(car);
        String expected = "{\"carName\":\"My New Car\",\"carOwner\":null}";
        assertThat(actual, is(expected));
    }

    @Test
    public void customizePropertyFormat() {
        var ship = new Ship("A002", "My new ship");
        var richUser = new RichUser("ABC00001", "Mike",
            LocalDate.of(1967, 12, 24), ship);

        var config = new JsonbConfig()
            // バイナリデータのフォーマットを指定しているが、この例では
            // toJsonが各フィールドに対して適用された結果が返される。
            .withBinaryDataStrategy(BinaryDataStrategy.BASE_64_URL)
            // 生成されるJSONがRFC7493に厳密に従うように指定している。
            .withStrictIJSON(true);

        var expected = "{\"birth\":\"1967/12/24\",\"card\":{\"code\":\"*****\"}," +
            "\"name\":\"Mike\",\"ship\":{\"id\":\"A002\",\"shipName\":\"My new ship\"}}";

        var actual = JsonbBuilder.create(config).toJson(richUser);

        assertThat(actual, is(expected));
    }

    private Feature getSampleFeature() {
        var point = new PointGeometry(Arrays.asList(1.0, 1.0));
        var propList = Arrays.asList(
            new DefaultProperty("name", "Mike"),
            new DefaultProperty("age", 24),
            // Collectionの値はJSONへシリアライズされるとき配列に変換される。
            new DefaultProperty("score", Arrays.asList(100, 90, 95, 88, 98))
        );
        var props = new DefaultProperties(propList);
        return new DefaultFeature(point, props);
    }

    @Test
    public void toJsonWithAdapter() {
        var feature = getSampleFeature();
        JsonbConfig config = new JsonbConfig()
            // プロパティ名に対する設定でありプロパティ値には効果無し。
            //.withPropertyNamingStrategy(PropertyNamingStrategy.UPPER_CAMEL_CASE)
            .withAdapters(new FeatureAdapter());
        var actual = JsonbBuilder.create(config).toJson(feature);

        // JSON-Pをそのまま使う場合
        //var actual = new FeatureAdapter().adaptToJson(feature).toString();

        System.out.println(actual);

        var expected = "{\"type\":\"Feature\",\"geometry\":{\"type\":\"Point\",\"coordinates\":[1.0,1.0]},\"properties\":{\"name\":\"Mike\",\"age\":24,\"score\":[100,90,95,88,98]}}";

        assertThat(actual, is(expected));
    }

}
