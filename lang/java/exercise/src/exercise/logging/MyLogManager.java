package exercise.logging;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class MyLogManager {
    
    private static final Logger MY_INFO = LogManager.getLogger("MyInfo");
//    private static final Log MY_INFO = LogFactory.getLog("MyInfo");
    
    public static void info(String message) {
       MY_INFO.info(message);
    }
    
    public static void debug(String message) {
       MY_INFO.debug(message);
    }
    
}