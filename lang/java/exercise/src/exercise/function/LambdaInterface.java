package exercise.function;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * LambdaInterfaceアノテーションをFunctionaInterfaceアノテーションと
 * 同じ内容にしても，FunctionaInterfaceアノテーションを指定した時に
 * 検出できるインターフェースのコンパイルエラーを検出することはできない。
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface LambdaInterface {
	String id();
	String name() default "no name";
}
