package moglabo.practicejava.net;

import java.net.InetAddress;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class AddressTest {
    
    @Test
    void ループバックアドレスを判別できる() throws Exception {
        var adr = InetAddress.getLocalHost();
        assertTrue(adr.isLoopbackAddress());
    }
    
}
