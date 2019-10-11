package myapp;

import java.util.ServiceLoader;
import sp1.Greetable;

public class MyAppMain {

  public static void main(String[] args) {
    // loadの引数がmosule-info.javaのusesで指定されていなければ
    // java.util.ServiceConfigurationErrorがスローされる。
    var services = ServiceLoader.load(Greetable.class);
    services.findFirst().ifPresent(Greetable::greet);
  }

}
