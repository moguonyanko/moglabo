package test.practiceazure;

import com.azure.storage.blob.*;
import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

public class TestAzureBlob {

    @Test
    public void getConnectionString() {
        var connectStr = System.getenv("AZURE_STORAGE_CONNECTION_STRING");
        assertNotNull(connectStr);
        assertFalse(connectStr.isEmpty());
    }

}
