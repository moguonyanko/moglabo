package exercise.rmi;

import java.rmi.AlreadyBoundException;
import java.rmi.Remote;
import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.UnicastRemoteObject;
import java.util.Map;
import java.util.function.Supplier;

public class MyRemoteServer {

    private static final Map<String, Supplier<? extends Remote>> OBJECTS = Map.of(
        "AddInt", RemoteIntCalculator::new,
        "MyManager", MyManager::new
    );

    private final int port;
    private final Registry registry;

    MyRemoteServer(int port) throws RemoteException {
        this.port = port;
        this.registry = LocateRegistry.createRegistry(port);
    }

    void startServer() {
        OBJECTS.entrySet().parallelStream()
            .forEach(entry -> {
                try {
                    var key = entry.getKey();
                    var initializer = entry.getValue();
                    var stub = UnicastRemoteObject.exportObject(initializer.get(),
                        this.port);
                    this.registry.bind(key, stub);
                } catch (RemoteException | AlreadyBoundException e) {
                    throw new IllegalStateException(e);
                }
            });
        System.out.println("サーバ起動完了:" + this.port);
    }

    public static void main(String[] args) {
        try {
            var port = 12345;
            var server = new MyRemoteServer(port);
            server.startServer();
        } catch (RemoteException e) {
            e.printStackTrace();
        }
    }

}
