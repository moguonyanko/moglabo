package exercise.rmi;

import java.rmi.Remote;
import java.rmi.RemoteException;

public interface Calculator<T extends Number> extends Remote {

    int add(T a, T b) throws RemoteException;

    // throws RemoteException が記述されていないとサーバ起動時に例外がスローされる。
//    default int add(T a, T b) throws RemoteException {
//        return a.intValue() + b.intValue();
//    }

}
