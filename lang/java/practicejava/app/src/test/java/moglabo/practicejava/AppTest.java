package moglabo.practicejava;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class AppTest {

    @Test
    void Appはgreetingメソッドを所有している() {
        var testApp = new App();
        assertNotNull(testApp.getGreeting());
    }
}
