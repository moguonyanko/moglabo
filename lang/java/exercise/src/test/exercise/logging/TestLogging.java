package test.exercise.logging;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

import exercise.logging.LogManager;

public class TestLogging {
    
    @Test
    public void Log4jでinfoログを出力できる() {
        LogManager.info("HelloInfoLog");
    }
    
}
