package test.exercise.lang;

import org.junit.Test;
import static org.junit.Assert.*;

public class TestSingleton {

    /**
     * 参考:
     * https://blogs.oracle.com/javamagazine/post/java-quiz-deserialize-enums-records
     */
    private static class SampleLazySingleton {

        static {
            System.out.println("準備中 SampleLazySingleton");
        }
        // フィールドの初期化が遅延される。
        private static final SampleLazySingleton singleton = new SampleLazySingleton();

        private SampleLazySingleton() {
            System.out.println("インスタンス生成 SampleLazySingleton");
        }

        public static SampleLazySingleton get() {
            return singleton;
        }

        @Override
        public String toString() {
            return "Hello singleton";
        }
        
    }

    /**
     * 興味深いテクニックではあるが初期化の順序に依存したコードを書くのは無用な複雑さと
     * 不具合を招く要因になるようにも思われる。
     */
    @Test
    public void デシリアライズを遅延できる() {
        System.out.println("遅延デシリアライズ調査開始！");
        SampleLazySingleton ls = null;
        System.out.println("ls変数がnullで初期化されました");
        var cl = SampleLazySingleton.class;
        System.out.println("評価完了 SampleLazySingleton.class");
        // get()するとSampleLazySingletonのstatic初期化子とコンストラクタが評価される。
        ls = SampleLazySingleton.get();
        System.out.println("シングルトンのインスタンス取得");
        System.out.println("遅延デシリアライズ調査完了！");
        System.out.println(ls);
    }

}
