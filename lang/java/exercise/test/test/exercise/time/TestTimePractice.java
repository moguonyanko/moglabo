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
import java.util.Locale;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.is;

import exercise.time.DayOfWeeks;
import exercise.time.LocalDates;
import exercise.time.TimeZones;
import java.time.temporal.TemporalAdjusters;

/**
 * Java8以降に導入されたjava.timeパッケージの調査を行うためのクラスです。
 * 
 * 参考：
 * 「The Java™ Tutorials」 Lesson: Standard Calendar
 * https://docs.oracle.com/javase/tutorial/datetime/iso/index.html
 * 
 */
public class TestTimePractice {
	
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
		DayOfWeeks dayOfWeek = new DayOfWeeks(DayOfWeek.MONDAY);
		
		DayOfWeek actual = dayOfWeek.next();
		DayOfWeek expected = DayOfWeek.TUESDAY;
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void toStringは曜日の文字列表現を返す(){
		DayOfWeeks dayOfWeek = 
			new DayOfWeeks(DayOfWeek.MONDAY, TextStyle.SHORT);
		
		String actual = dayOfWeek.toString();
		String expected = "月";
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void その月の最後の日を得る(){
		LocalDate date = LocalDate.of(2016, Month.FEBRUARY, 14);

		LocalDate expected = LocalDate.of(2016, Month.FEBRUARY, 29);
		LocalDate actual = LocalDates.lastDayOfMonth(date);
		
		assertThat(actual, is(expected));
	}
	
	private static DateTimeFormatter getPatternForTest(){
		return DateTimeFormatter.ofPattern("yyyy MM dd hh mm");
	}
	
	@Test
	public void 現在時刻をタイムゾーン付きで得る(){
		ZonedDateTime expected = ZonedDateTime.now();
		ZoneId zoneId = ZoneId.of("Asia/Tokyo");
		ZonedDateTime actual = TimeZones.now(zoneId);
		
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
		
		OffsetDateTime actual = TimeZones.getOffsetDateTime(fromZoneId, toZoneId);
		
		/**
		 * ミリ秒を比較されるとテストに失敗する。
		 * 秒を含まずにテストするように書式化を行う。
		 */
		DateTimeFormatter formatter = getPatternForTest();
		assertThat(actual.format(formatter), is(expected.format(formatter)));
	}
	
	@Test
	public void 月の最大の日数を得る(){
		Month m = Month.FEBRUARY;
		Locale locale = Locale.getDefault();
		
		int actual = m.maxLength();
		/**
		 * 2月はうるう年では29日あるので最大日数は29が返される。
		 */
		int expected = 29;
		
		assertThat(actual, is(expected));
		
		System.out.println(m.getDisplayName(TextStyle.FULL, locale));
		System.out.println(m.getDisplayName(TextStyle.FULL_STANDALONE, locale));
	}
	
	@Test
	public void 特定の日を基点として別の日を得る(){
		LocalDate baseDate = LocalDate.of(2015, Month.SEPTEMBER, 18);
		
		LocalDate actual = baseDate.with(TemporalAdjusters.next(DayOfWeek.FRIDAY));
		LocalDate expected = LocalDate.of(2015, Month.SEPTEMBER, 25);
		
		assertThat(actual, is(expected));
		
		System.out.printf("現在は %s です。次の金曜日は %s です。%n", baseDate, actual);
	}
	
	@Test
	public void 指定した日の曜日を得る(){
		LocalDate sample = LocalDate.of(2015, Month.SEPTEMBER, 18);
		
		DayOfWeek expected = DayOfWeek.FRIDAY;
		DayOfWeek actual = sample.getDayOfWeek();
		
		assertThat(actual, is(expected));
	}
	
}
