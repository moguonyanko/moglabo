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
}
