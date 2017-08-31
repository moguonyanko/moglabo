package test.exercise.lang;

import org.junit.*;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

/**
 * 参考:
 * http://www.journaldev.com/13121/java-9-features-with-examples
 */
public class TestProcess {
    @Test
    public void canGetCurrentProcessId() {
        ProcessHandle currentProcess = ProcessHandle.current();
        long pid = currentProcess.pid();
        System.out.println("Current PID = " + pid);
    }

    @Test
    public void canGetCurrentProcessInfo() {
        ProcessHandle handle = ProcessHandle.current();
        ProcessHandle.Info info = handle.info();
        System.out.println(info);
    }
}
