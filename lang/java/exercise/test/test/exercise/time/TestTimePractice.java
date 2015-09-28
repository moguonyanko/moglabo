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
import java.time.temporal.TemporalAdjusters;
import java.time.LocalTime;
import java.time.MonthDay;
import java.time.Year;
import java.time.YearMonth;
import java.time.ZoneOffset;

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
import java.time.Instant;
import java.time.temporal.ChronoUnit;

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
	
	@Test
	public void 指定した年月を得てうるう年かどうかを確認できる(){
		YearMonth yearMonth = YearMonth.of(2015, Month.SEPTEMBER);
		
		boolean expected = false;
		boolean actual = yearMonth.isLeapYear();

		assertThat(actual, is(expected));
		
		System.out.printf("現在は %s で %d 日あります。"
			+ "うるう年判定結果は %b です。 %n", 
			yearMonth, yearMonth.lengthOfMonth(), actual);
	}
	
	@Test
	public void 妥当な月日の指定かどうかを確認できる(){
		/**
		 * 9月31日など存在しない月日をofの引数に指定すると，
		 * MonthDay.isValidYearを呼ぶまでも無くDateTimeExceptionが発生する。
		 */
		MonthDay monthDay = MonthDay.of(Month.SEPTEMBER, 30);
		
		boolean expected = true;
		boolean actual = monthDay.isValidYear(2015);
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void 指定した年がうるう年かどうかを確認できる(){
		Year year = Year.of(2015);
		
		boolean expected = false;
		boolean actual = year.isLeap();
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void ナノ秒を含む時刻を表現する(){
		/**
		 * 第4引数でナノ秒を指定することができる。
		 */
		LocalTime localTime = LocalTime.of(14, 38, 30, 99999);
		
		int expected = 99999;
		int actual = localTime.getNano();
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void 日付と時刻を合わせて操作する(){
		LocalDate date = LocalDate.of(2015, Month.SEPTEMBER, 24);
		LocalTime time = LocalTime.of(15, 7, 30, 99999);
		LocalDateTime localDateTime = LocalDateTime.of(date, time);
		
		/**
		 * Monthオブジェクトは引数で渡せるがYearオブジェクトは渡すことができない。
		 */
		LocalDateTime expected = LocalDateTime.of(date.getYear(), 
			Month.DECEMBER, date.getDayOfMonth(), 
			time.getHour(), time.getMinute(), time.getSecond(), time.getNano());
		
		/* 3ヶ月進める。 */
		LocalDateTime actual = localDateTime.plusMonths(3);
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void ローカル時間にタイムゾーンを適用する(){
		LocalDateTime localDateTime = LocalDateTime.of(2015, Month.SEPTEMBER, 25, 16, 30);
		ZoneId zoneId = ZoneId.systemDefault();
		ZonedDateTime actual = localDateTime.atZone(zoneId);
		
		/**
		 * ZonedDateTime.ofにはMonthを渡せない。
		 */
		ZoneId jstId = TimeZones.getZoneId("JST");
		ZonedDateTime expected = ZonedDateTime.of(2015, Month.SEPTEMBER.getValue()
			, 25, 16, 30, 0, 0, jstId);
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void 時差を考慮して時刻を計算する(){
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy年 MMM月 d日 ahh時mm分");

		LocalDateTime fromLocalTime = LocalDateTime.of(2015, Month.SEPTEMBER, 25, 17, 4);
		ZoneId fromZone = ZoneId.of("Asia/Tokyo");
		ZonedDateTime fromZoneTime = ZonedDateTime.of(fromLocalTime, fromZone);
		
		int deltaMinutes = 720;
		
		ZoneId toZone = ZoneId.of("Europe/Berlin");
		ZonedDateTime toZoneTime = fromZoneTime.withZoneSameInstant(toZone)
			.plusMinutes(deltaMinutes);
		
		String expected = "2015年 9月 25日 午後10時04分";
		String actual = toZoneTime.format(formatter);
		
		assertThat(actual, is(expected));
		System.out.printf("%s の%d分後の時刻 -> %s %n", toZone, deltaMinutes, actual);
		
		boolean inSummerTime = TimeZones.inSummerTime(toZoneTime);
		
		if(inSummerTime){
			System.out.printf("%s はサマータイムにあります。%n", toZone);
		}else{
			System.out.printf("%s はサマータイムにありません。%n", toZone);
		}
	}
	
	@Test
	public void ローカル時間に時差を追加する(){
		LocalDateTime localDate = LocalDateTime.of(2015, Month.SEPTEMBER, 25, 17, 33);
		ZoneOffset offset = ZoneOffset.of("+12:00");
		
		OffsetDateTime expected = OffsetDateTime .of(2015, Month.SEPTEMBER.getValue(), 
			25, 17, 33, 0, 0, offset);
		
		OffsetDateTime offsetDate = OffsetDateTime.of(localDate, offset);
		OffsetDateTime actual = offsetDate.with(TemporalAdjusters.lastInMonth(DayOfWeek.FRIDAY));
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void 標準Javaエポックからの経過秒数を与えてタイムスタンプを得る(){
		Instant timestamp = Instant.ofEpochSecond(1443418752L);
		LocalDateTime localTimestamp = LocalDateTime.ofInstant(timestamp, ZoneId.systemDefault());
		
		String expected = "2015年 9月 28日 14時39分";
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy年 MMM月 d日 HH時mm分");
		String actual = localTimestamp.format(formatter);
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void ISO日付フォーマッタで日付を得る(){
		LocalDate expected = LocalDate.of(2015, Month.SEPTEMBER, 28);
		String input = "20150928";
		LocalDate actual = LocalDate.parse(input, DateTimeFormatter.BASIC_ISO_DATE);
		
		assertThat(actual, is(expected));
	}
	
}
