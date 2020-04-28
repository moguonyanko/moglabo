package test.exercise.lang;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.function.Function;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

import exercise.lang.InnerClassPractice;
import exercise.lang.InnerClassPractice.Inner;
import exercise.lang.InnerClassPractice.InnerComparableClass;
import exercise.lang.InnerClassPractice.InnerStatic;
import exercise.lang.InnerInterfacePractice;
import exercise.lang.InnerInterfacePractice.InnerClass;
import exercise.lang.InnerInterfacePractice.StaticInnerClass;

/**
 * 参考：
 * 「Exam 1Z0-810: Upgrade Java SE 7 to Java SE 8 OCP Programmer Study Guide」
 * http://java.boot.by/ocpjp8-upgrade-guide/
 */
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
	
	@Test
	public void インターフェースの内部クラスをインスタンス化する(){
		String testName0 = "hoge";
		String testName1 = "foo";
		
		StaticInnerClass sic = new InnerInterfacePractice.StaticInnerClass(testName0);
		/**
		 * インターフェース内のクラスは暗黙の静的内部クラスになるので，
		 * 以下のコードはコンパイルエラーである。
		 */
		//InnerClass ic = new InnerInterfacePractice().new InnerClass("testName1");
		InnerClass ic = new InnerInterfacePractice.InnerClass(testName1);
		
		assertThat(sic.getName(), is(testName0));
		assertThat(ic.getName(), is(testName1));
	}
	
	@Test
	public void ローカルクラスを使ったメソッドで文字列を修飾する(){
		String actual = InnerClassPractice.getModifiedString("hoge");
		assertNotNull(actual);
		
		System.out.println(actual);
	}
	
	private int innerVal = 1;
	
	private void makeInner(){
		InnerClass2 i = new InnerClass2();
		i.display();
	}
	
	private class InnerClass2{
		private void display(){
			System.out.println(innerVal);
			/**
			 * このthisはInnerClass2のインスタンスを指す。
			 */
			System.out.println(this);
			/**
			 * エンクロージングクラスのthisを参照するには
			 * staticメソッドを参照するような記法でなければならない。
			 */
			System.out.println(TestInnerClass.this);
		}
	}
	
	@Test
	public void 内部クラスのメンバを確認する(){
		InnerClass2 i = new TestInnerClass().new InnerClass2();
		i.display();
		/**
		 * 以下は同じ出力になる。
		 */
		new TestInnerClass().makeInner();
	}
	
	private String shadow = "エンクロージングクラスのフィールド";
	
	private class InnerClass3{
		private String shadow = "内部クラスのフィールド";
		
		private void printShadow(String shadow){
			System.out.println("shadow = " + shadow);
			System.out.println("this.shadow = " + this.shadow);
			System.out.println("TestInnerClass.this.shadow = " + TestInnerClass.this.shadow);
		}
	}
	
	@Test
	public void 内部クラスのフィールドのシャドウイングを調べる(){
		new InnerClass3().printShadow("メソッドの引数");
	}

	/**
	 * 参考
	 * https://blogs.oracle.com/otnjp/records-come-to-java-ja
	 */
	@Test
	public void 匿名クラスの型名を確認する() {
		var o1 = new Object() {
			String getName() {
				return "Mike";
			}
		};

		var o2 = new Object() {
			String getName() {
				return "Mery";
			}
		};

		// o1とo2は型が異なるため代入はコンパイルエラーとなる。
		//o1 = o2;

		assertNotEquals(o1.getClass().getTypeName(), o2.getClass().getTypeName());
	}
	
}
