//DEPS org.junit.jupiter:junit-jupiter-api:5.10.0
//DEPS jakarta.json:jakarta.json-api:2.1.3
//DEPS org.eclipse.parsson:parsson:1.1.7

package org.moglabo.tryjava;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;

public class TestJsonObject {

  @Test
  void test_createJsonObject() {
        var builder = Json.createObjectBuilder();
        var jb = Json.createObjectBuilder();
        jb.add("message", "Hello");
        builder.add("result", jb);
        var json = builder.build();
        assertEquals("{\"result\":{\"message\":\"Hello\"}}", json.toString());
  }

}
