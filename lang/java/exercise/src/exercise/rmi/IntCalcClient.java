package exercise.rmi;

import java.rmi.NotBoundException;
import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;

public class IntCalcClient {

    public int addInt(int a, int b) throws RemoteCalculatorException {
        try {
            var registry = LocateRegistry.getRegistry("localhost", 12345);
            // Remoteインターフェースを継承したインターフェースの型でキャストしないと
            // ClassCastExceptionとなる。ただしキャストされた型のインターフェースを
            // 継承したインターフェースでリモートメソッドを再宣言していれば問題ない。
            var obj = registry.lookup("ADDINT");
            if (obj instanceof Calculator) {
                var calculator = (Calculator<Integer>)obj;
                return calculator.add(a, b);
            } else {
                throw new RemoteCalculatorException("リモートオブジェクト取得失敗");
            }
        } catch (Exception e) {
            throw new RemoteCalculatorException(e);
        }
    }

}
