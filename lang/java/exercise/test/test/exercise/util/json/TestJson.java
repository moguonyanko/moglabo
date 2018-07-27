package test.exercise.util.json;

import java.awt.geom.Point2D;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import javax.json.bind.JsonbBuilder;
import javax.json.bind.JsonbConfig;
import javax.json.bind.config.BinaryDataStrategy;
import javax.json.bind.config.PropertyNamingStrategy;
import javax.json.bind.config.PropertyOrderStrategy;

import org.junit.Ignore;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

import exercise.util.json.*;
import exercise.util.json.geo.*;
import exercise.util.json.geo.feature.*;

/**
 * JSON-P(javax.json, javax.json.api)のjarはバージョン1.1以上であることが必須である。
 * <p>
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

        var expected = "{\"birth\":\"1967/12/24\",\"card\":{\"code\":\"********\"}," +
            "\"name\":\"Mike\",\"ship\":{\"id\":\"A002\",\"shipName\":\"My new ship\"}}";

        var actual = JsonbBuilder.create(config).toJson(richUser);

        assertThat(actual, is(expected));
    }

    private Feature getSampleFeature() {
        var point = new PointGeometry(new Point2D.Double(1.0, 1.0));
        var propList = Arrays.asList(
            new DefaultProperty<>("name", "Mike"),
            new DefaultProperty<>("age", 24),
            // Collectionの値はJSONへシリアライズされるとき配列に変換される。
            new DefaultProperty<>("score", Arrays.asList(100, 90, 95, 88, 98))
        );
        var props = new DefaultProperties(propList);
        return new DefaultFeature(point, props);
    }

    @Ignore("登録したJsonbAdapterが使われる方法が分かるまで無視")
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

    @Test
    public void getEnumJson() {
        var geom = new PointGeometry(new Point2D.Double(2.0, 4.0));
        var actual = JsonbBuilder.create().toJson(geom);
        var expected = "{\"coordinates\":[2.0,4.0],\"type\":\"Point\"}";
        assertThat(actual, is(expected));
    }

    @Test
    public void getDateJson() {
        var timeRecord = new TimeRecord();
        var actual = JsonbBuilder.create().toJson(timeRecord);
        var expected = "{\"recordDuration\":\"PT10H30M59S\",\"recordTime\":\"2018-07-25 05:20\"}";
        assertThat(actual, is(expected));
    }

    @Test
    public void changePropertyNameOnRuntime() {
        var book = new Book("A001", "My Java", "Hoge Foo");
        var config = new JsonbConfig()
            .withPropertyNamingStrategy(
                PropertyNamingStrategy.UPPER_CAMEL_CASE);

        var actual = JsonbBuilder.create(config).toJson(book);
        var expected = "{\"Author\":\"Hoge Foo\",\"BookKey\":\"A001-My Java\",\"Name\":\"My Java\",\"bookid\":\"A001\"}";

        assertThat(actual, is(expected));
    }

    @Test
    public void customizePropertyNames() {
        String inputJson = "{\"userComment\":\"Hello\",\"age\":46,\"userName\":\"Bar\"}";
        var actual = JsonbBuilder.create().fromJson(inputJson, SampleUser.class);
        var expected = new SampleUser("Bar", 46, "Hello");
        assertThat(actual, is(expected));
    }

    @Test
    public void customizePropertyOrder() {
        var car = new Car("My car", "Taro Tokyo");
        var expected = "{\"driverName\":\"Taro Tokyo\",\"carName\":\"My car\"}";
        var actual = JsonbBuilder.create().toJson(car);
        assertThat(actual, is(expected));
    }

    @Test
    public void customizePropertyVisibility() {
        var user = new SampleUser2("Taro");
        var vs = new UserPropertyVisibilityStrategy();
        var config = new JsonbConfig().withPropertyVisibilityStrategy(vs);
        var actual = JsonbBuilder.create(config).toJson(user);
        var expected = "{\"userName\":\"Taro\"}";
        assertThat(actual, is(expected));
    }

    @Test
    public void createObjectFromJsonWithoutSetter() {
        var expected = new Ship("B001", "New Ship");
        var json = "{\"shipId\":\"B001\",\"shipName\":\"New Ship\"}";
        var actual = JsonbBuilder.create().fromJson(json, Ship.class);
        assertThat(actual, is(expected));
    }

    @Test
    public void customNumberFormat() {
        var time = LocalDateTime.of(2018, Month.JULY, 26, 16, 30);
        var price = 99800000L;
        var clock = new Clock(time, price);
        // デシリアライズ時は以下のように適切な日付のフォーマットでJSONが構成されていないと
        // パースに失敗してしまいJavaオブジェクトへ変換することができない。
        //var json = "{\"clockTime\":\"2018-07-26T16:30:00\",\"clockPrice\":99800000}";
        //var clock = JsonbBuilder.create().fromJson(json, Clock.class);
        var expected = "{\"clockTime\":\"2018/07/26 16:00\",\"clickPrice\":\"99,800,000\"}";
        var actual = JsonbBuilder.create().toJson(clock);
        assertThat(actual, is(expected));
    }

    @Test
    public void adaptFieldAdapter() {
        var card = new Card("MY CODE");
        var expected = "{\"code\":\"*******\"}";
        var actual = JsonbBuilder.create().toJson(card);
        assertThat(actual, is(expected));
    }

    @Ignore("JsonbDeserializerが使用されない理由が分かるまで無視")
    @Test
    public void generateJsonWithLowLevelApi() {
        var user = new RegisteredUser(12345, "Tokyo Jiro");
        var config = new JsonbConfig()
            .withSerializers(new RegisteredUserSerializer())
            .withDeserializers(new RegisteredUserDeserializer());
        var builder = JsonbBuilder.create(config);
        var json = builder.toJson(user);
        System.out.println(json);
        var actual = builder.fromJson(json, RegisteredUser.class);
        System.out.println(actual);
        assertTrue(actual.getName().isEmpty());
    }

    @Test
    public void toJsonWithFieldAdapter() {
        // 参考: 以下のようなリストの生成方法もある。
        //var example = new ArrayList<>() {{
        //    add(new Point2D.Double(0.0, 0.0));
        //    add(new Point2D.Double(1.0, 0.0));
        //    add(new Point2D.Double(0.0, 1.0));
        //    add(new Point2D.Double(0.0, 0.0));
        //}};
        List<Point2D> list =
            Arrays.asList(
                new Point2D.Double(0.0, 0.0),
                new Point2D.Double(1.0, 0.0),
                new Point2D.Double(1.0, 1.0),
                new Point2D.Double(1.5, 1.5),
                new Point2D.Double(0.0, 1.0),
                new Point2D.Double(0.0, 0.0)
            );
        var polygon = new PolygonGeometry(list);
        var expected = "{\"coordinates\":[[0.0,0.0],[1.0,0.0],[1.0,1.0],[1.5,1.5],[0.0,1.0],[0.0,0.0]],\"type\":\"Polygon\"}";
        var actual = JsonbBuilder.create().toJson(polygon);
        assertThat(actual, is(expected));
    }

}
