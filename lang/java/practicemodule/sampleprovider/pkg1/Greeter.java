package pkg1;

import sp1.Greetable;

public class Greeter implements Greetable {

  @Override
  public void greet() {
    System.out.println("Hello from Greeter");
  }
  
}
