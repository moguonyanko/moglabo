package test.exercise.time;

import java.time.DayOfWeek;
import java.time.format.TextStyle;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.is;

import exercise.time.DayOfWeekPractice;
import exercise.time.LocalPractice;
import exercise.time.TimeZonePractice;

public class TestTimePractice {
	
	public TestTimePractice() {
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
	
	@Test
	public void その月の最後の日を得る(){
		LocalDate date = LocalDate.of(2016, Month.FEBRUARY, 14);

		LocalDate expected = LocalDate.of(2016, Month.FEBRUARY, 29);
		LocalDate actual = LocalPractice.lastDayOfMonth(date);
		
		assertThat(actual, is(expected));
	}
	
	private static DateTimeFormatter getPatternForTest(){
		return DateTimeFormatter.ofPattern("yyyy MM dd hh mm");
	}
	
	@Test
	public void 現在時刻をタイムゾーン付きで得る(){
		ZonedDateTime expected = ZonedDateTime.now();
		ZoneId zoneId = ZoneId.of("Asia/Tokyo");
		ZonedDateTime actual = TimeZonePractice.now(zoneId);
		
		/**
		 * 秒及びミリ秒はテストする要素に含めたくないが分までは含めたいので，
		 * ZonedDateTime.toLocalDate()の戻り値で比較するのは避け，
		 * ZonedDateTime.format(DateTimeFormatter)の戻り値で比較を行っている。
		 */
		DateTimeFormatter formatter = getPatternForTest();
		assertThat(actual.format(formatter), is(expected.format(formatter)));
	}
	
	@Test
	public void 時差を考慮した時刻を得る(){
		ZoneId fromZoneId = ZoneId.of("Asia/Tokyo");
		ZoneId toZoneId = ZoneId.of("Europe/Berlin");
		
		/* 時差が +07:00 ある。 */
		ZonedDateTime berlinZonedDateTime = LocalDateTime.now()
			.minusHours(7)
			.atZone(toZoneId);
		OffsetDateTime expected = berlinZonedDateTime.toOffsetDateTime();
		
		OffsetDateTime actual = TimeZonePractice.getOffsetDateTime(fromZoneId, toZoneId);
		
		/**
		 * ミリ秒を比較されるとテストに失敗する。
		 * 秒を含まずにテストするように書式化を行う。
		 */
		DateTimeFormatter formatter = getPatternForTest();
		assertThat(actual.format(formatter), is(expected.format(formatter)));
	}
	
}
