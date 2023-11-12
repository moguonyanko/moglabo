package org.moglabo.tryjava;

public class HelloTryJava {
  public static void main(String[] args) {
    var name = "Taro";
    var age = 50;
    var greeting = STR."\{name} is \{age} years old.";
    //var greeting = name + " is " + age + " years old.";
    System.out.println(greeting);
  }
}
