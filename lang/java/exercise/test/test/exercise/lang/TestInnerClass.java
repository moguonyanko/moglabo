package test.exercise.lang;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.function.Function;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

import exercise.lang.InnerClassPractice;
import exercise.lang.InnerClassPractice.Inner;
import exercise.lang.InnerClassPractice.InnerComparableClass;
import exercise.lang.InnerClassPractice.InnerStatic;

public class TestInnerClass {
	
	@Test
	public void ネストされた内部クラスのインスタンスを生成できる(){
		Inner inner = new InnerClassPractice().new Inner();
		
		String expected = "sample string from Inner";
		String actual = inner.getSampleString();
		
		assertThat(actual, is(expected));
	}

	@Test
	public void 静的な内部クラスのインスタンスを生成できる(){
		InnerStatic innerStatic = new InnerClassPractice.InnerStatic();
		
		String expected = "static sample string from InnerStatic";
		String actual = innerStatic.getSampleString();
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void 無名クラスのインスタンスを生成できる(){
		String suffix = " by testcase";
		
		/**
		 * suffixへの変更を行うとsuffixが「実質的final」でなくなるのでコンパイルエラーになる。
		 * ただし変更を行っている行に到達しないならばコンパイルエラーにならない。
		 */
		if(false)suffix += "!";
		
		InnerClassPractice anonymous = new InnerClassPractice(){

			@Override
			public String getMyString() {
				return super.getMyString() + " from anonymous" + suffix;
			}
			
		};
		
		/**
		 * 「実質的final」であるべき値が内部クラスの定義の後に変更されても
		 * コンパイルエラーになる。 やはり変更を行っている行に到達しないならば
		 * コンパイルエラーにならない。
		 */
		if(false)suffix += "?";
		
		String expected = "sample string from anonymous" + suffix;
		String actual = anonymous.getMyString();
		
		assertThat(actual, is(expected));
	}
	
	private static class InnerDivSorter{
		
		private static final int DIV = 15;
		
		private static int getSortKey(InnerComparableClass ic){
			/**
			 * DIVで割った余りが小さい順にソートさせる。
			 */
			return ic.getInnerId() % DIV;
		}
		
	}
	
	@Test
	public void 内部インターフェースを実装したクラスのオブジェクト群をソートする(){
		InnerClassPractice icp = new InnerClassPractice();
		Inner inner150 = icp.new Inner(150);
		Inner inner200 = icp.new Inner(200);
		Inner inner100 = icp.new Inner(100);
		
		InnerComparableClass ic150 = icp.new InnerComparableClass(inner150);
		InnerComparableClass ic200 = icp.new InnerComparableClass(inner200);
		InnerComparableClass ic100 = icp.new InnerComparableClass(inner100);
		
		List<InnerComparableClass> ics = Arrays.asList(ic150, ic200, ic100);
		
		List<InnerComparableClass> expected = Arrays.asList(ic150, ic200, ic100);
		
		List<InnerComparableClass> actual = ics.stream()
			.sorted()
			/**
			 * compareToを実装している内部インターフェースが
			 * private指定されていたりすると，
			 * <pre>
			 * sorted(InnerComparableClass::compareTo)
			 * </pre>
			 * は<em>実行時に</em>」IllegalAccessErrorを発生させる。
			 * アクセス不可能なコードをコンパイラが検出できないようだ。
			 * 
			 * privateな内部インターフェースにdefaultメソッドでcompareToを
			 * 定義していなくてもIllegalAccessErrorになる。
			 * privateな内部インターフェースを実装したpublicなクラスに
			 * compareToがオーバーライドされていてもIllegalAccessErrorになる。
			 * 
			 * InnerComparableClass.getInnerIdは呼び出してもエラーにならない。
			 * getInnerIdもprivateな内部インターフェースで宣言されているメソッドである。
			 * getInnerId内で内部インターフェースの型を参照してもエラーにならない。
			 */
			//.sorted(InnerComparableClass::compareTo)
			.peek(ic -> {
				try{
					/* 以下の行もIllegalAccessErrorを発生させる。 */
					Function<InnerComparableClass, Integer> fn = ic::compareTo;
					System.out.println(fn.getClass().getCanonicalName());
				}catch(Throwable t){
					System.err.println(t.getMessage());
				}
				/* comapreTo以外のメソッドは呼び出しても問題無し。 */
				System.out.println(ic.getInnerId());
			})
			.sorted(Comparator.comparing(InnerDivSorter::getSortKey))
			.peek(System.out::println)
			.collect(Collectors.toList());
		
		assertThat(actual, is(expected));
	}
	
}
