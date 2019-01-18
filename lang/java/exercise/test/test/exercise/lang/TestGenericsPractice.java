package test.exercise.lang;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

import exercise.lang.MyContainer;
import exercise.lang.GenericMyContainer;

/**
 * 参考：
 * 「Java Tutorial」(オラクル)
 */
public class TestGenericsPractice {

	public TestGenericsPractice() {
	}

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

	/**
	 * 参考：
	 * http://docs.oracle.com/javase/tutorial/java/generics/genTypeInference.html
	 */
	private static <T> T getWithTypeInference(T t1, T t2) {
		return t2;
	}

	@Test
	public void 共通の型で推論する() {
		/**
		 * getWithTypeInferenceの第1引数と第2引数はどちらも
		 * Serializableをimplementsしている。
		 * したがってgetWithTypeInferenceの戻り値の型変数Tは
		 * 問題無くSerializableに推論されてしまう。
		 * しかしこのような型推論は意図通りでない可能性もある。
		 * 型パラメータの境界を出来る限り設定するのが望ましい。
		 */
		Serializable actual = getWithTypeInference("hoge", new ArrayList<Number>());
		assertNotNull(actual);
	}

	/**
	 * 参考：
	 * http://docs.oracle.com/javase/tutorial/java/generics/capture.html
	 */
	private static class WildcardCapture {

		private void resetFirstValue(List<?> src) {
			/**
			 * List.getで返される要素の型を正確に把握することができないため
			 * List.setの第2引数に渡す際にコンパイルエラーになる。
			 */
			//src.set(0, src.get(0));

			/**
			 * List<T>を引数に取るヘルパーメソッドにList<?>を渡せば
			 * List.getの型はTだと決定できるのでコンパイルエラーは発生しなくなる。
			 */
			resetFirstValueHelper(src);
		}

		private <T> void resetFirstValueHelper(List<T> src) {
			src.set(0, src.get(0));
		}

	}

	@Test
	public void ワイルドカードのキャプチャに伴うエラーをヘルパーメソッドで回避する() {
		List<String> src = Arrays.asList("foo", "bar", "baz");
		WildcardCapture wc = new WildcardCapture();
		wc.resetFirstValue(src);

		String expected = "foo";
		String actual = src.get(0);

		assertThat(actual, is(expected));
	}

	private static class WildcardCaptureComplex {

		private void swapFirstValue(List<? extends Number> left,
			List<? extends Number> right) {
			/**
			 * WildcardCapture.resetFirstValueど同様の理由でコンパイルエラーになる。
			 */
			//Number leftFirst = left.get(0);
			//left.set(0, right.get(0));
			//right.set(0, leftFirst);

			//swapFirstValueHelper(left, right);
		}

		/**
		 * TとVに互換性が無いので結局ヘルパーメソッドも
		 * コンパイルエラーになってしまう。
		 * 確かにこれで上手くいってしまったら数値計算プログラム等で
		 * 致命的な問題が引き起こされるかもしれない。
		 */
		//private <T extends Number, V extends Number> void
		//	swapFirstValueHelper(List<T> left, List<V> right) {
		//	Number leftFirst = left.get(0);
		//	left.set(0, right.get(0));
		//	right.set(0, leftFirst);
		//}
		
		private void swapFirstValueWithoutGenerics(List<Integer> left,
			List<Double> right) {
			Integer leftFirst = left.get(0);
			left.set(0, right.get(0).intValue());
			right.set(0, leftFirst.doubleValue());
		}

	}

	@Test
	public void 複雑なワイルドカードのキャプチャに伴うエラーを検証する() {
		List<Integer> left = Arrays.asList(5, 6, 7);
		List<Double> right = Arrays.asList(1.0, 2.0, 3.5);
		WildcardCaptureComplex wcc = new WildcardCaptureComplex();
		wcc.swapFirstValueWithoutGenerics(left, right);

		Number expected = 1;
		Number actual = left.get(0);

		assertThat(actual, is(expected));
	}
	
	/**
	 * 参考：
	 * http://docs.oracle.com/javase/tutorial/java/generics/nonReifiableVarargsType.html
	 */
	private static class ArrayBuilder{
		
		/**
		 * Tに境界が指定されていない場合，T...はイレイジャによりObject[]になる。
		 * 可能な限り型変数には境界を指定する方が安全ということか？
		 */
		private static <T> void addToList(List<T> targetList, T... elements){
			Arrays.stream(elements).forEach(targetList::add);
		}
		
		/**
		 * faultyMethodは可変引数メソッドでありstaticでもあるので
		 * SafeVarargsアノテーションはコンパイルエラーを発生させてくれない。
		 * http://docs.oracle.com/javase/jp/8/docs/api/java/lang/SafeVarargs.html
		 */
		@SafeVarargs
		private static void faultyMethod(List<String>... list){
			/**
			 * List<String>...はList[]としてコンパイラに解釈される。
			 * List[]はObject[]のサブタイプなのでObject[]型の変数に
			 * 代入することができる。
			 */
			Object[] objs = list;
			int pollutionValue = 1000;
			List pollutionList = Arrays.asList(pollutionValue);
			objs[0] = pollutionList;
			/**
			 * listが汚染されているためlist[0]はList<Integer>になっている。
			 * その結果ClassCastExceptionがスローされる。
			 */
			String heepPol = list[0].get(0);
			System.out.println("ヒープ汚染の結果例外が発生します。" + heepPol);
		}
		
	}
	
	@Test(expected = ClassCastException.class)
	public void ジェネリックメソッドでヒープ汚染を発生させる(){
		List<String> sample1 = new ArrayList<>();
		List<String> sample2 = new ArrayList<>();
		
		ArrayBuilder.addToList(sample1, "foo", "bar", "baz");
		ArrayBuilder.addToList(sample2, "hoge", "fuga", "neko");
		
		List<List<String>> listOfSampleLists = new ArrayList<>();
		
		ArrayBuilder.addToList(listOfSampleLists, sample1, sample2);
		
		List<String> errList1 = Arrays.asList("Hello, ");
		List<String> errList2 = Arrays.asList("world!");
		
		ArrayBuilder.faultyMethod(errList1, errList2);
	}

	@Test
	public void 自作のジェネリッククラスに値を追加したり取得したりできる() {
		//ここで<String>を書かないとGenericMyContainerの型引数EはObjectにされてしまう。
		MyContainer<String> container = new GenericMyContainer<>();
		
		container.append("foo");
		container.append("bar");
		container.append("baz");
		
		String expected = "baz";
		String actual = container.get(2);
		
		assertThat(actual, is(expected));
	}

	private abstract class AbstractBase<T> {

		abstract List<T> getFunc();

		abstract void setFunc(List<T> src);

		abstract <E> List<E> getFunc2();

		abstract <E> void setFunc2(List<E> src);

		abstract void setFunc3(List<?> src);
	}

	private class SampleChild extends AbstractBase<Double> {

		@Override
		List<Double> getFunc() {
			return null;
		}

		@Override
		void setFunc(List<Double> src) {

		}

		@Override
		List<Double> getFunc2(){
			return null;
		}

		// コンパイルエラーになってしまう。
//		@Override
//		void setFunc2(List<Double> src) {
//
//		}

		@Override
		<E> void setFunc2(List<E> src) {

		}

		@Override
		void setFunc3(List<?> src) {

		}
	}
}
