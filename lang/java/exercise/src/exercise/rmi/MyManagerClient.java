package exercise.rmi;

import java.rmi.NotBoundException;
import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;

public class MyManagerClient {

    public SampleManager getSampleManager(int port) {
        SampleManager obj = null;
        try {
            var registry = LocateRegistry.getRegistry("localhost", port);
            obj = (SampleManager)registry.lookup("MyManager");
        } catch (RemoteException | NotBoundException e) {
            e.printStackTrace();
        }
        return obj;
    }

}
