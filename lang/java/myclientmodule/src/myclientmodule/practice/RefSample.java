package myclientmodule.practice;

import java.lang.reflect.Constructor;
import java.lang.reflect.Method;

public class RefSample {

    private static void callServiceMethod(String packageName) {
        try {
            Class<?> c = Class.forName(packageName);
            Constructor<?>[] cs = c.getConstructors();
            // 型を直接参照するにはそれを含むパッケージがexportsされている必要がある。
            //Object o = cs[0].newInstance();
            //Animal cat = (Animal)o;
            //cat.enjoy();
            Method[] ms = c.getDeclaredMethods();
            for (Method m : ms) {
                System.out.println(m.getName());
                // setAccessibleを使いprivateメソッドにもアクセスできるようにする。
                // クラスを含むパッケージがサービス側(=myservicemodule)の
                // モジュール記述子(=module-info.java)でopens指定されていないと
                // privateメソッドに対してsetAccessibleを呼び出した時に
                // InaccessibleObjectExceptionがスローされる。
                m.setAccessible(true);
                m.invoke(cs[0].newInstance());
            }
        } catch (ReflectiveOperationException e) {
            System.err.println(e.getMessage());
        }
    }

    public static void main(String[] args) {
        callServiceMethod("myservicemodule.ref.Cat");
        // myservicemoduleのモジュール記述子でmyservicemodule.toolsが
        // opensされていないと，myservicemodule.toolsがexportsされていても
        // InaccessibleObjectExceptionがスローされる。
        //callServiceMethod("myservicemodule.tools.SamplePen");
    }
}
