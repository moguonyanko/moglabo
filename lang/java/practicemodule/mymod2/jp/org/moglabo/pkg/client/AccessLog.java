package jp.org.moglabo.pkg.client;

import java.util.function.Supplier;

import jp.org.moglabo.pkg.sample.SampleLogger;

public class AccessLog {

  public static void main(String[] args) {
    // 左辺の型をvarで記述するとget呼び出しでコンパイルエラーになる。
    // Supplier<SampleLogger> supplier = SampleLogger::new;
    // var logger = supplier.get();
    var logger = new SampleLogger();
    try {
      var privateField = logger.getClass().getDeclaredField("LOGGER");
      // SampleLoggerを含むモジュールのmodule-info.javaでopenが指定されていなければ
      // InaccessibleObjectExceptionがスローされる。
      privateField.setAccessible(true);
      System.out.println(privateField.get(logger).getClass().getCanonicalName());
    } catch (NoSuchFieldException | IllegalAccessException ex) {
      ex.printStackTrace();
    }
  }

}
