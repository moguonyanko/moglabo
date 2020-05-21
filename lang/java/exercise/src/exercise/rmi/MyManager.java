package exercise.rmi;

import java.io.IOException;
import java.rmi.RemoteException;

public class MyManager implements RemoteSampleManager {
    @Override
    public void report() {
        System.out.println("MyManager report");
    }

    @Override
    public int getCode() {
        return 0;
    }

    @Override
    public String getMessage() {
        return "MyManager is running";
    }

    @Override
    public void checkPositiveInt(int x) throws Exception {
        if (x < 0) {
            throw new Exception("MyManager error");
        }
    }
}
