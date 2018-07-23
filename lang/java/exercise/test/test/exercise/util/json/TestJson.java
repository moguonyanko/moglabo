package test.exercise.util.json;

import javax.json.bind.JsonbBuilder;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

import exercise.util.json.*;

/**
 * 参考:
 * https://www.ibm.com/developerworks/library/j-javaee8-json-binding-1/index.html
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
        var actual = JsonbBuilder.create().toJson(student);
        // デフォルトでは生成されるJSONのプロパティはアルファベット順で並んでいる。
        System.out.println(actual);

        var expected = getStudentJson();

        assertThat(actual, is(expected));
    }

    // デシリアライズ(JSON -> Java Object)
    @Test
    public void convertFromJson() {
        var actual = JsonbBuilder.create()
            .fromJson(getStudentJson(), Student.class);
        System.out.println(actual);

        var expected = getStudent();

        assertThat(actual, is(expected));
    }
}
