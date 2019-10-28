package app;

import java.util.Arrays;

import logging.InfoLogger;

/**
 * 参考:
 * http://java.boot.by/ocpjd11-upgrade-guide/ch06s02.html
 */
public class App {

  public static void main(String... args) {
    InfoLogger.warn("ログテスト開始！");
    var logger = InfoLogger.getLogger();
    logger.info("テストは正常に実行中です。");
    logger.info(Arrays.toString(args));
  }

}