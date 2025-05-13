//DEPS org.junit.jupiter:junit-jupiter-api:5.10.0

package test.org.moglabo.tryjava;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class TestJunitJupiter {

  @Test
  void testHello() {
    var greeting = "Hello";
    assertSame("Hello", greeting);
  }
  
}
