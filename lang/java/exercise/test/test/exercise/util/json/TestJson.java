package test.exercise.util.json;

import javax.json.bind.JsonbBuilder;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

import exercise.util.json.*;

/**
 * 参考:
 * https://www.ibm.com/developerworks/jp/java/library/j-whats-new-in-javaee-8/index.html
 * http://www.baeldung.com/java-json-binding-api
 */
public class TestJson {

    @Test
    public void convertJson() {
        var obj = new Student();
        //obj.setName("DummyId");
        String json = JsonbBuilder.create().toJson(obj);
        System.out.println(json);

        var actual = JsonbBuilder.create().fromJson(json, Student.class);

        assertThat(actual, is(obj));
    }
}
