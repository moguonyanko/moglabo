package exercise.rmi;

import java.rmi.Remote;
import java.rmi.RemoteException;

public interface IntCalculator extends Remote, Calculator<Integer> {

    // リモートメソッドを再宣言すれば継承元のインターフェースがRemoteを継承して
    // いなくてもリモートメソッド呼び出しは成功する。ただし継承元インターフェースの
    // メソッドが継承先でRemoteExceptionをthrowsできるように宣言されていなければ
    // ならない。リモートメソッドの再宣言がコンパイルエラーになるためである。
    Integer add(Integer a, Integer b) throws RemoteException;

}
