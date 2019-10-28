package pkg2;

import pkg3.*;

public class SampleB implements InterfaceB {

  private final InterfaceA a;

  public SampleB(InterfaceA a) {
    this.a = a;
  }

  @Override
  public void mB1(){
    a.mA2();
  }

  @Override
  public void mB2() {

  }

}
