package test.exercise.time;

import exercise.time.DayOfWeekPractice;
import java.time.DayOfWeek;
import static org.hamcrest.CoreMatchers.is;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

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
}
