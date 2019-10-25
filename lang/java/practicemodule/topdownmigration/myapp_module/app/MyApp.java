package app;

import static logging.MyLogger.*;

/**
 * サンプルログ出力アプリ
 * 元々 Modular Application ではないところから移行していく。 
 * 
 * 参考:
 * http://java.boot.by/ocpjd11-upgrade-guide/ch06.html
 */
public class MyApp {

  public static void main(String[] args) {
    info("アプリケーション起動しました");
    var logger = getLog();
    logger.warning("アプリケーションは何もせず終了しました");
  }

}
