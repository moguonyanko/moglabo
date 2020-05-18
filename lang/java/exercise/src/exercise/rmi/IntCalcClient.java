package exercise.rmi;

import java.rmi.NotBoundException;
import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;

public class IntCalcClient {

    public int addInt(int a, int b) throws RemoteCalculatorException {
        try {
            var registry = LocateRegistry.getRegistry("localhost", 12345);
            // Remoteインターフェースをextendsしたインターフェースの型でキャストしないと
            // ClassCastExceptionとなる。
            var calculator = (Calculator<Integer>)registry.lookup("ADDINT");
            return calculator.add(a, b);
        } catch (RemoteException | NotBoundException e) {
            throw new RemoteCalculatorException(e);
        }
    }

}
