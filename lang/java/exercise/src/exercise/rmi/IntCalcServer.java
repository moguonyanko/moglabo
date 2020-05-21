package exercise.rmi;

import java.rmi.AlreadyBoundException;
import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.server.UnicastRemoteObject;

public class IntCalcServer {

    private static final int PORT = 12345;

    public static void main(String[] args) {
        try {
            var calculator = new RemoteIntCalculator();
            var stub = UnicastRemoteObject.exportObject(calculator, PORT);
            var registry = LocateRegistry.createRegistry(PORT);
            registry.bind("AddInt", stub);

            System.out.println("整数計算サーバ起動完了:" + PORT);
        } catch (RemoteException re) {
            System.err.println("RMIサーバ起動失敗:" + re.getMessage());
        } catch (AlreadyBoundException ae) {
            System.err.println("登録しようとした名前は既に使用されています。");
        }
    }

}
