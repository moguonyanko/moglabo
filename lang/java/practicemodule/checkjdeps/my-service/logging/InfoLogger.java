package logging;

import java.util.logging.Logger;

/**
 * 参考:
 * http://java.boot.by/ocpjd11-upgrade-guide/ch06s02.html
 */

public class InfoLogger {

  private static final Logger LOGGER = Logger.getLogger(InfoLogger.class.getName());

  public static void warn(String message) {
    LOGGER.warning(message);
  }

  public static Logger getLogger() {
    return LOGGER;
  }

} 