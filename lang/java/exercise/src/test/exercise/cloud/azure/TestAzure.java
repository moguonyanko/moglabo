package test.exercise.cloud.azure;

import java.net.URISyntaxException;
import java.security.InvalidKeyException;

import com.microsoft.azure.storage.*;
import com.microsoft.azure.storage.file.*;

import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

public class TestAzure {

    private static final String CONNECTION_STRING =
        "DefaultEndpointsProtocol=http;" +
            "AccountName=;" +
            "AccountKey=";

    private CloudStorageAccount connect()
        throws InvalidKeyException, URISyntaxException {
        var storageAccount = CloudStorageAccount.parse(CONNECTION_STRING);
        return storageAccount;
    }

    @Test
    public void canConnectStorageAccount() {
        try {
            connect();
        } catch (Exception e) {
            fail(e.getMessage());
        }
    }

}
