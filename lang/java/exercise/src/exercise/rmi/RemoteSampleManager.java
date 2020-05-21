package exercise.rmi;

import java.rmi.Remote;
import java.rmi.RemoteException;

public interface RemoteSampleManager extends SampleManager, Remote {

    void report() throws RemoteException;

    // SampleManagerの型でRMIクライアントはリモートメソッド呼び出しできるが、
    // 呼び出されるメソッドはあくまでもリモートインターフェースすなわち
    // RemoteSampleManagerのメソッドとして宣言されていなければならない。
    void checkPositiveInt(int x) throws Exception;

}
