package pkg1;

import pkg3.*;

public class SampleA implements InterfaceA {

  private final InterfaceB b;

  public SampleA(InterfaceB b) {
    this.b = b;
  }

  @Override
  public void mA1() {
    b.mB2();
  }

  @Override
  public void mA2() {

  }

}
