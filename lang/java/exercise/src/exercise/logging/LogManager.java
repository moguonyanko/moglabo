package exercise.logging;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class LogManager {
    
    private static final Log MY_INFO = LogFactory.getLog("MyInfo");
    
    public static void info(String message) {
       MY_INFO.info(message);
    }
    
}
