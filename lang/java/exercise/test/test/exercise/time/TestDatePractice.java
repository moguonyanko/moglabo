package test.exercise.time;

import java.time.DayOfWeek;
import java.time.format.TextStyle;

import static org.hamcrest.CoreMatchers.is;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

import exercise.time.DayOfWeekPractice;

public class TestDatePractice {
	
	public TestDatePractice() {
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

	@Test
	public void nextは翌日の曜日を得る(){
		DayOfWeekPractice dayOfWeek = new DayOfWeekPractice(DayOfWeek.MONDAY);
		
		DayOfWeek actual = dayOfWeek.next();
		DayOfWeek expected = DayOfWeek.TUESDAY;
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void toStringは曜日の文字列表現を返す(){
		DayOfWeekPractice dayOfWeek = 
			new DayOfWeekPractice(DayOfWeek.MONDAY, TextStyle.SHORT);
		
		String actual = dayOfWeek.toString();
		String expected = "月";
		
		assertThat(actual, is(expected));
	}
}
