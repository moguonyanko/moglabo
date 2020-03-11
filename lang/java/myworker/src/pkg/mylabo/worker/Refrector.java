package pkg.mylabo.worker;

import pkg.mylabo.calculator.Calculator;

/**
 * 参考:
 * http://java.boot.by/ocpjd11-upgrade-guide/ch01s02.html
 */
public class Refrector {

    public static void main(String[] args) {
        try {
            var calculator = new Calculator();
            var fieldName = "VERSION";
            var field = calculator.getClass().getDeclaredField(fieldName);
            // Calculatorが属するモジュールあるいはパッケージがopenやopens指定されていないと
            // 「実行時エラー」になる。openに変更されれば再ビルドせずとも実行に成功する。
            field.setAccessible(true);
            var type = field.get(calculator).getClass().getCanonicalName();
            System.out.println(fieldName + " type = " + type);
        } catch (ReflectiveOperationException e) {
            System.err.println(e.getMessage());
        }
    }

}
