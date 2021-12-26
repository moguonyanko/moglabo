package test.exercise.logging;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

import exercise.logging.MyLogManager;

public class TestLogging {
    
    @Test
    public void Log4jでログを出力できる() {
        MyLogManager.info("Hello Info");
        MyLogManager.debug("Hello Debug");
    }
    
}
