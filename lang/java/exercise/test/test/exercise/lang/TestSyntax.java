package test.exercise.lang;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

import exercise.lang.EnumFruits;
import exercise.lang.StaticFruits;

public class TestSyntax {

	@Test
	public void 三項演算子の優先度を調べる(){
		boolean expected = false;
		boolean actual = true ? false : true == true ? false: true;
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void enumは定数変数かどうかを調べる(){
		String actual = EnumFruits.APPLE.name();
		String expected = "APPLE";
		
		assertThat(actual, is(expected));
	}	
	
	@Test
	public void public_static_finalは定数変数かどうかを調べる(){
		String actual = StaticFruits.APPLE;
		String expected = "APPLE";
		
		assertThat(actual, is(expected));
	}

	/**
	 * 参考:
	 * https://www.infoq.com/news/2018/03/Java10GAReleased
	 */
	@Test
	public void canRunAnonymousClassInstanceMethod() {
		Object obj = new Object() {
			public void runTest() {
				System.out.println("Hello test");
			}
		};
		// 以下のコードはObject型を介してrunTestメソッドを見つけることができないため
		// コンパイルエラーになる。変数objがJava10以降で使用可能であるvarで宣言されて
		// いればコンパイルに成功する。
		//obj.runTest();
	}

	// 参考:
	// JavaMagazine Vol.40
	private static class Calc {
		public static void execute() {
			int i = 0;
			Calc c = new Calc();
			// incを呼び出す前にi++が評価されてその結果がincに渡される。
			// しかしこの行での加算は後置インクリメントであるため「評価前」の
			// 値が用いられる。すなわち 0 + 2 となる。
			System.out.print(i++ + c.inc(i));
			System.out.print(i);
		}
		private int inc(int i) {
			// 引数のiをインクリメントしているが値渡しであるため
			// 呼び出し元のiには影響がない。
			System.out.print(i++);
			return i;
		}
	}

	@Test
	public void checkIncrementSequence() {
		Calc.execute();
	}
}
