package exercise.function;

import java.util.function.BiFunction;
import java.util.function.Supplier;

/**
 * 参考:
 * Swift Language Guide:Automatic Reference Counting
 * https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/AutomaticReferenceCounting.html#//apple_ref/doc/uid/TP40014097-CH20-ID48
 */
public class HTMLElement {

	private String name;
	private String text;

	//メモリを確保していることを分かりやすくするための配列
	private final int[] dummyMemory = new int[1024 * 1000 * 10];
	//private static final int[] DUMMY_MEMORY = new int[1024 * 1000 * 10];
	
	public HTMLElement(String name, String text) {
		this.name = name;
		this.text = text;
	}
	
	private static String createHTML(String name, String text) {
		StringBuilder html = new StringBuilder();
		if (text != null) {
			html.append("<").append(name).append(">");
			html.append(text);
			html.append("</").append(name).append(">");
		} else {
			html.append("<").append(name).append(" />");
		}
		return html.toString();
	}

	/**
	 * Swiftの場合，self(Javaにおけるthis)を介して循環参照が発生する。
	 */
	public Supplier<String> asHTML = () -> {
		/**
		 * 自身のフィールドにアクセスしないラムダ式であってもメモリが解放されない。
		 */
		//return "<p>sample</p>";
		/**
		 * thisをWeakReferenceに保存してもこのオブジェクトのメモリは解放されない。
		 * WeakReferenceを介してfinalフィールドにアクセスする場合，
		 * 初期化されていない可能性を伝える内容のコンパイルエラーが発生しない。
		 */
		//WeakReference<HTMLElement> wRef = new WeakReference<>(this);
		
		return createHTML(this.name, this.text);
	};
	
	public static BiFunction<String, String, String> asStaticHTML = 
		(String name, String text) -> createHTML(name, text);
}
