package practicejsf.annotation;

/**
 * @todo
 * ManagedBeanのフィールドのアクセッサメソッドをいちいち書くのが面倒なので
 * アノテーションで対応できるようにしたい。
 */
public @interface Getter {
	
	String value() default "";
	
	/**
	 * アノテーション型でジェネリックスは使用できない。
	 */
	//<T> T value();
	
}
