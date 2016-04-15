package test.exercise.lang.ref;

import java.lang.ref.ReferenceQueue;
import java.lang.ref.WeakReference;
import java.util.function.Consumer;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

import exercise.lang.ref.WeakUserManager;
import exercise.lang.ref.WeakKey;
import exercise.lang.ref.WeakUser;

/**
 * 参考:
 * https://community.oracle.com/blogs/enicholas/2006/05/04/understanding-weak-references
 * https://www.palantir.com/2007/11/writing-junit-tests-for-memory-leaks/
 */
public class TestWeakReference {

    @BeforeClass
    public static void setUpClass() {
    }

    @AfterClass
    public static void tearDownClass() {
    }

    @Before
    public void setUp() {
    }

    @After
    public void tearDown() {
    }

    private <T> void printFreeMemory(Consumer<T> consumer) {
        long beforeByte = Runtime.getRuntime().freeMemory();
        System.out.println("Before free memory(byte):" + beforeByte);

        consumer.accept(null);
        System.gc();

        long afterByte = Runtime.getRuntime().freeMemory();
        System.out.println("After free memory(byte):" + afterByte);
    }

    @Test
    public void 弱く到達可能なオブジェクトがガベージコレクトされる() {
        WeakUser user = new WeakUser("hogehoge");

        ReferenceQueue<WeakUserManager> queue = new ReferenceQueue<>();
        WeakReference<WeakUserManager> ref = new WeakReference(user, queue);

        long beforeByte = Runtime.getRuntime().freeMemory();
        System.out.println("Before free memory(byte):" + beforeByte);

        /**
         * nullを代入しなければガベージコレクトされない。
         */
        user = null;
        /**
         * ラムダ式の外側の変数は実質的にfinalでなければならないので変更できない。
         */
        //printFreeMemory((WeakUser u) -> {
        //    user = null;
        //});
        System.gc();

        long afterByte = Runtime.getRuntime().freeMemory();
        System.out.println("After free memory(byte):" + afterByte);

        /**
         * WeakReference.isEnqueuedが真ならば弱参照オブジェクトは
         * ガベージコレクトされたと考えてよいのだろうか。
         */
        assertTrue(ref.isEnqueued());
    }

    @Test
    public void 強く到達可能なオブジェクトに保持されていた弱く到達可能なオブジェクトがガベージコレクトされる() {
        WeakUserManager stronglyReachableManager = new WeakUserManager();
        WeakKey key = new WeakKey("sample weak key 1");
        WeakUser user = new WeakUser("hogehoge");
        stronglyReachableManager.setUser(key, user);
        
        ReferenceQueue<WeakUserManager> queue = new ReferenceQueue<>();
        WeakReference<WeakUserManager> ref = new WeakReference(user, queue);

        long beforeByte = Runtime.getRuntime().freeMemory();
        System.out.println("Before free memory(byte):" + beforeByte);

        System.out.println("Removed user name ... " + stronglyReachableManager.removeUser(key));
        System.out.println("Is WeakKey " + key + " removed? ... " + !stronglyReachableManager.has(key));
        /**
         * エントリを削除するだけではガベージコレクトされない。
         * エントリを削除せずuserにnullを代入しただけでもガベージコレクトされない。
         * 
         * WeakUserManager.removeUserの戻り値はuserと等しい。
         * この戻り値を別のローカル変数に保存するとuserにnullを代入しても
         * userはガベージコレクトされなくなる。強く到達可能かつuserと等しい
         * オブジェクトが存在することになるからだろうか。
         */
        user = null;
        System.gc();

        long afterByte = Runtime.getRuntime().freeMemory();
        System.out.println("After free memory(byte):" + afterByte);

        assertTrue(ref.isEnqueued());
    }

}
