package test.exercise.lang;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

import exercise.lang.InnerClassPractice;
import exercise.lang.InnerClassPractice.Inner;
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
	
}
