package exercise.rmi;

import java.io.IOException;
import java.rmi.RemoteException;

/**
 * 参考:
 * https://docs.oracle.com/javase/jp/13/docs/specs/rmi/objmodel.html
 */
public interface SampleManager {

    int getCode() throws IOException;

    String getMessage() throws RemoteException;

    void checkPositiveInt(int x) throws Exception;

}
