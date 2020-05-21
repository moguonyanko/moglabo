package exercise.rmi;

import java.rmi.AlreadyBoundException;
import java.rmi.Remote;
import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.server.UnicastRemoteObject;
import java.util.Map;
import java.util.function.Supplier;

public class RemoteServer {

    private static final int PORT = 12345;

    private static final Map<String, Supplier<? extends Remote>> OBJECTS = Map.of(
        "AddInt", RemoteIntCalculator::new,
        "MyManager", MyManager::new
        );

    public static void main(String[] args) {
        try {
            var registry = LocateRegistry.createRegistry(PORT);
            for (String key : OBJECTS.keySet()) {
                var init = OBJECTS.get(key);
                var stub = UnicastRemoteObject.exportObject(init.get(), PORT);
                registry.bind(key, stub);
            }
            System.out.println("サーバ起動完了:" + PORT);
        } catch (RemoteException | AlreadyBoundException e) {
            e.printStackTrace();
        }
    }

}
