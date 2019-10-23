package p3;

import sp1.Greetable;

public class MyProvider {
  public static Greetable provider() {
    Greetable g = () -> System.out.println("MyProviderからこんにちは！");
    return g;
  }
}
