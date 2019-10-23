package myapp;

import java.util.ServiceLoader;
import java.util.ServiceLoader.Provider;

import sp1.Greetable;

public class MyAppMain {

  public static void main(String[] args) {
    // loadの引数がmosule-info.javaのusesで指定されていなければ
    // java.util.ServiceConfigurationErrorがスローされる。
    var services = ServiceLoader.load(Greetable.class);
    services.findFirst().ifPresent(Greetable::greet);

    ServiceLoader.load(Greetable.class)
              .stream()
              .filter(p -> MyAppMain.startsWith(p, "Greet"))
              .map(Provider::get)
              .findFirst()
              .ifPresent(Greetable::greet);
  }

  private static boolean startsWith(Provider provider, String name) {
    return provider.type().getSimpleName().startsWith(name);
  }

}
