package exercise.rmi;

public interface Calculator<T extends Number> {

    T add(T a, T b) throws Exception;

    // throws RemoteException が記述されていないとサーバ起動時に例外がスローされる。
//    default int add(T a, T b) throws RemoteException {
//        return a.intValue() + b.intValue();
//    }

}
