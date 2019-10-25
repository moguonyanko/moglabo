package logging;

import java.util.logging.*;

/**
 * サンプルログ出力ライブラリ
 * Modular Application ではない。
 * 
 * 参考: http://java.boot.by/ocpjd11-upgrade-guide/ch06.html
 */
public class MyLogger {

  private static final Logger LOG = Logger.getLogger(MyLogger.class.getName());

  public static void info(String message) {
    LOG.info(message);
  }

  public static Logger getLog() {
    return LOG;
  }

}
