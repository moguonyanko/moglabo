package jp.org.moglabo.pkg.client;

import jp.org.moglabo.pkg.sample.SampleLogger;

public class SampleClient {

  public static void main(String[] args) {
    SampleLogger.logInfo();
    // Loggerクラスを含むモジュールがrequires transitiveでなければコンパイルエラーになる。
    var logger = SampleLogger.getLogger();
    logger.info("Logger: requires transitive");
  }

}