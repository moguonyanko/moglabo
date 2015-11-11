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
import java.time.LocalTime;
import java.time.MonthDay;
import java.time.Year;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.time.temporal.JulianFields;
import java.time.temporal.Temporal;
import java.time.temporal.TemporalAdjuster;
import java.time.temporal.TemporalQueries;
import java.time.temporal.TemporalQuery;
import java.time.temporal.TemporalUnit;
import java.time.temporal.ChronoField;
import java.time.temporal.TemporalAccessor;
import java.time.Duration;
import java.time.Period;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.List;
import java.util.function.IntUnaryOperator;
import java.time.Clock;
import java.time.chrono.ChronoLocalDate;
import java.time.chrono.Chronology;
import java.time.chrono.JapaneseChronology;
import java.time.chrono.JapaneseEra;
import java.time.temporal.UnsupportedTemporalTypeException;
import java.time.format.FormatStyle;
import static java.time.temporal.TemporalAdjusters.*;

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
		
		/**
		 * ZoneRunes.isDaylightSavingsはZonedDateTimeの
		 * インスタンスメソッドだった方が利用しやすかったと思う。
		 */
		ZonedDateTime berlinZonedDateTime = LocalDateTime.now().atZone(toZoneId);
		
		boolean isSummerTime = TimeZones.inSummerTime(berlinZonedDateTime);
		
		/**
		 * ベルリンと日本では，ベルリンがサマータイムの時は
		 * 日本が7時間進んでいて，サマータイムでない時は日本が
		 * 8時間進んでいる。ベルリンから見るとベルリンの方が
		 * 時間が遅れているのでZonedDateTime.minusHoursを実行する。
		 */
		if(isSummerTime){
			berlinZonedDateTime = berlinZonedDateTime.minusHours(7);
		}else{
			berlinZonedDateTime = berlinZonedDateTime.minusHours(8);
		}
		
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
		
		LocalDate actual = baseDate.with(next(DayOfWeek.FRIDAY));
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
		OffsetDateTime actual = offsetDate.with(lastInMonth(DayOfWeek.FRIDAY));
		
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
		LocalDate expected1 = LocalDate.of(2015, Month.SEPTEMBER, 28);
		LocalDate actual1 = LocalDate.parse("20150928", DateTimeFormatter.BASIC_ISO_DATE);
		
		assertThat(actual1, is(expected1));
		System.out.println(actual1);
		
		LocalDate expected2 = LocalDate.of(2015, Month.NOVEMBER, 11);
		LocalDate actual2 = LocalDate.parse("11.11.2015", DateTimeFormatter.ofPattern("dd.MM.yyyy"));
		
		assertThat(actual2, is(expected2));
		/**
		 * LocalDate.parseの第2引数に指定したパターンは「第1引数をこのパターンで
		 * パースするする」ことだけを示しており，生成されたLocalDateの文字列表現を
		 * 示しているわけではない。フォーマッタを介さずにLocalDateの文字列表現を
		 * 得るとISO_LOCAL_DATE(yyyy-MM-dd)に従った結果が返される。
		 */
		System.out.println(actual2);
		
		LocalDate expected3 = LocalDate.of(2015, Month.DECEMBER, 31);
		LocalDate actual3 = LocalDate.parse("2015-12-31", DateTimeFormatter.ISO_LOCAL_DATE);
		
		assertThat(actual3, is(expected3));
		System.out.println(actual3);
	}
	
	@Test
	public void 日付に関するフィールドや単位のサポート状況を調べる(){
		/**
		 * サードパーティ製の日付ライブラリを使用している時に
		 * isSupportedメソッドによるテストは有用なのかもしれない。
		 */
		
		/**
		 * LocalDateはユリウス日の日付フィールドをサポートしている。
		 */
		boolean isSupportedJulianDay = LocalDate.now().isSupported(JulianFields.JULIAN_DAY);
		assertTrue(isSupportedJulianDay);
		
		/**
		 * LocalTimeは日付単位をサポートしていない。
		 */
		boolean isSupportedChronoDay = LocalTime.now().isSupported(ChronoUnit.DAYS);
		assertFalse(isSupportedChronoDay);
	}

	@Test
	public void 特定の日を基点として任意の日付を得る(){
		LocalDate baseDate = LocalDate.of(2015, Month.SEPTEMBER, 29);
		DayOfWeek dayOfWeek = baseDate.getDayOfWeek();
		
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy年MM月dd日");
		
		String expected = "2015年10月06日";
		String actual = DayOfWeeks.nextDate(baseDate, dayOfWeek).format(formatter);
		
		assertThat(actual, is(expected));
		
		System.out.println(actual);
	}
	
	private static class SalaryAdjuster implements TemporalAdjuster {

		private final int salaryDay;

		public SalaryAdjuster(int salaryDay) {
			this.salaryDay = salaryDay;
		}
		
		/**
		 * 給料支払日が土日だった場合は直前の金曜日を給料支払日とする。
		 */
		@Override
		public Temporal adjustInto(Temporal temporal) {
			LocalDate date = LocalDate.from(temporal);
			
			LocalDate salaryDate = date.withDayOfMonth(salaryDay);
			
			DayOfWeek dow = salaryDate.getDayOfWeek();
			if(dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY){
				salaryDate = salaryDate.with(previous(DayOfWeek.FRIDAY));
			}
			
			return temporal.with(salaryDate);
		}

	}
	
	@Test
	public void カスタマイズしたアジャスタで任意の日付を得る(){
		/**
		 * 通常の給料支払日を23日とする。
		 */
		int standardSalaryDay = 23;
		TemporalAdjuster adjuster = new SalaryAdjuster(standardSalaryDay);
		
		/**
		 * 2015年8月は23日が日曜日なので21日が給料支払日になる。
		 */
		LocalDate sampleDate0 = LocalDate.of(2015, Month.AUGUST, 1);
		LocalDate expected0 = LocalDate.of(2015, Month.AUGUST, 21);
		LocalDate actual0 = sampleDate0.with(adjuster);
		
		assertThat(actual0, is(expected0));
		
		/**
		 * 2015年9月は23日が水曜日なのでそのまま23日が給料支払日になる。
		 */
		LocalDate sampleDate1 = LocalDate.of(2015, Month.SEPTEMBER, 1);
		LocalDate expected1 = LocalDate.of(2015, Month.SEPTEMBER, 23);
		LocalDate actual1 = sampleDate1.with(adjuster);
		
		assertThat(actual1, is(expected1));
	}
	
	@Test
	public void 最も小さい日付または時刻の単位を得る(){
		TemporalQuery<TemporalUnit> query = TemporalQueries.precision();
		
		OffsetDateTime dateTime = OffsetDateTime.of(LocalDateTime.now(), ZoneOffset.of("-12:00"));
		
		/**
		 * OffsetDateTimeはナノ秒まで扱える。
		 */
		String expected = "Nanos";
		String actual = dateTime.query(query).toString();
		
		assertThat(actual, is(expected));
	}
	
	private static class UpdateDays implements TemporalQuery<Boolean>{

		/**
		 * アップデート作業を実施する曜日
		 */
		private final DayOfWeek updateDayOfWeek;

		public UpdateDays(DayOfWeek updateDayOfWeek) {
			this.updateDayOfWeek = updateDayOfWeek;
		}
		
		@Override
		public Boolean queryFrom(TemporalAccessor temporal) {
			int dow = temporal.get(ChronoField.DAY_OF_WEEK);
			DayOfWeek dayOfWeek = DayOfWeek.of(dow);
			
			return updateDayOfWeek.equals(dayOfWeek);
		}
		
	}
	
	private static class EventDays{
		
		/**
		 * イベントの開催日一覧
		 */
		private final Set<LocalDate> eventDays;

		public EventDays(List<LocalDate> eventDayList) {
			this.eventDays = new HashSet<>(eventDayList);
		}

		public Boolean isEventDay(TemporalAccessor temporal){
			int year = temporal.get(ChronoField.YEAR);
			int month = temporal.get(ChronoField.MONTH_OF_YEAR);
			int day = temporal.get(ChronoField.DAY_OF_MONTH);
			LocalDate localDate = LocalDate.of(year, month, day);
			
			return eventDays.contains(localDate);
		}
	}
	
	@Test
	public void カスタマイズした日付照会クラスで特定の日付に該当するかどうかを調べる(){
		/**
		 * 毎週金曜日がアップデート作業日とする。
		 */
		UpdateDays updateDays = new UpdateDays(DayOfWeek.FRIDAY);
		
		/**
		 * イベント開催日は9月から11月の適当な日とする。
		 */
		List<LocalDate> eventDayList = Arrays.asList(
			LocalDate.of(2015, Month.SEPTEMBER, 23),
			LocalDate.of(2015, Month.OCTOBER, 9),
			LocalDate.of(2015, Month.NOVEMBER, 18)
		);
		
		EventDays eventDays = new EventDays(eventDayList);
		
		LocalDate date = LocalDate.of(2015, Month.OCTOBER, 9);
		
		Boolean isUpdateDay = date.query(updateDays);
		/**
		 * TemporalQueryはFunctionalInterfaceなので，TemporalQuery型を要求される
		 * 箇所にはラムダ式あるいはメソッド参照を渡すことができる。
		 */
		Boolean isEventday = date.query(eventDays::isEventDay);
		
		assertTrue(isUpdateDay && isEventday);
		
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy年M月d日(E)");
		String info = date.format(formatter);
		
		System.out.println(info + "はアップデート作業日かつイベント開催日です。");
	}
	
	/**
	 * @todo
	 * メソッド内のスコープでラムダ式による再帰を記述する方法はあるか？
	 */
	private static final IntUnaryOperator FIBONACCI  = n -> {
		if (n <= 1) {
			return n;
		} else {
			return TestTimePractice.FIBONACCI .applyAsInt(n - 1)
				+ TestTimePractice.FIBONACCI .applyAsInt(n - 2);
		}
	};
	
	@Test
	public void メソッドの実行時間を計測する(){
		Instant start = Instant.now();
		
		int arg = 30;
		FIBONACCI .applyAsInt(arg);
		
		Instant end = Instant.now();
		
		/**
		 * Durationはナノ秒まで扱うことができる。
		 * Durationは時間をベースとして期間を表す。
		 * しかしDurationのはDuration.ofDays(long)メソッドがある。
		 */
		long execTime = Duration.between(start, end).toNanos();
		
		System.out.printf("フィボナッチ数列計算時間は引数 %d のとき %d ナノ秒でした。%n", arg, execTime);
	}
	
	@Test
	public void 任意の日付間の日数を得る(){
		LocalDate start = LocalDate.of(2010, Month.OCTOBER, 15);
		LocalDate end = LocalDate.of(2015, Month.APRIL, 1);
		/**
		 * Periodは日付をベースとして期間を表す。
		 * Period.getDaysは日付の差しか返さない。
		 * 月を日に換算して日数を返したりはしない。
		 * したがってPeriod.getDaysのみでは期間中の
		 * 合計日数を得ることはできない。
		 * なおPeriod.getDaysとPeriod.get(ChronoUnit.DAYS)は
		 * 型以外は同じ結果を返す。
		 */
		Period period = Period.between(start, end);
		
		long expected = 1629;
		long actual = LocalDates.toTotalDays(start, end);
		
		assertThat(actual, is(expected));
		
		System.out.printf("%s と %s の間の月数は %s 月です。%n", start, end, period.toTotalMonths());
		System.out.printf("%s と %s の間の日数は %d 日です。%n", start, end, actual);
	}
	
	@Test
	public void 指定された期間を加えたクロックを得る(){
		LocalDateTime baseTime = LocalDateTime.of(2015, Month.OCTOBER, 2, 17, 2);
		long totalEpochSecond = baseTime.toEpochSecond(ZoneOffset.UTC);
		Instant baseInstant = Instant.ofEpochSecond(totalEpochSecond);
		
		ZoneId zoneId = ZoneId.of("Asia/Tokyo");
		/* 3日後のClockを得る。 */
		int days = 3;
		Period period = Period.ofDays(days);
		/**
		 * Instant.fromは引数にTemporalAccessor型の値を取る。
		 * TemporalAccessor型はTemporal型のスーパーインターフェースなので，
		 * Temporal型の値をInstant.fromに渡すことができる。
		 * 
		 * Instant.from(LocalDate)は実行時例外として
		 * DateTimeExceptionがスローされる。
		 * LocalDateからInstantが得られないためである。
		 */
		Instant instant = baseInstant.plus(period);
		Clock fixedClock = Clock.fixed(instant, zoneId);
		
		/**
		 * Duration.fromにPeriodを渡すと実行時例外として
		 * UnsupportedTemporalTypeExceptionがスローされる。
		 * 
		 * Clock.systemは現在のシステム時間を保持したClockを返す。
		 */
		Duration duration = Duration.ofDays(days);
		Clock clock = Clock.fixed(baseInstant, zoneId);
		Clock offsetClock = Clock.offset(clock, duration);
		
		/**
		 * Clock.fixedはFixedClockを返し，Clock.offsetはOffsetClockを返す。
		 * 仮に両者の指す時点が同じでもequalsで両者が等しいと判定されることは無い。
		 * Clock.instantでInstantを取得し，それを比較してテストする。
		 */
		assertThat(offsetClock.instant(), is(fixedClock.instant()));
	}
	
	@Test
	public void ISO暦体系の日付からISO暦体系以外の日付を得る(){
		String expected = "平成27年10月2日";
		
		LocalDate isoDate = LocalDate.of(2015, Month.OCTOBER, 2);
		Chronology notIsoChrono = JapaneseChronology.INSTANCE;
		String pattern = "Gy年M月d日";
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
		ChronoLocalDate notIsoDate = notIsoChrono.date(isoDate);
		String actual = notIsoDate.format(formatter);
		
		assertThat(actual, is(expected));
		
		String isoDateInfo = isoDate.format(formatter);
		
		System.out.printf("%s は和暦で表すと %s です。%n", isoDateInfo, actual);
	}
	
	@Test
	public void ISO暦体系以外の日付からISO暦体系の日付を得る(){
		String expected = "西暦2015-10-02";
		
		String pattern = "Gyyyy-MM-dd";
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
		
		Chronology notIsoChrono = JapaneseChronology.INSTANCE;
		ChronoLocalDate notIsoDate = notIsoChrono.date(JapaneseEra.HEISEI, 27, 10, 2);
		LocalDate isoDate = LocalDate.from(notIsoDate);
		String actual = isoDate.format(formatter);
		
		assertThat(actual, is(expected));
		
		String notIsoDateInfo = notIsoDate.format(formatter);
		
		System.out.printf("%s は西暦で表すと %s です。%n", notIsoDateInfo, actual);
	}
	
	@Test
	public void 負の値を指定して日付を得る(){
		LocalDate date = LocalDate.of(2015, Month.OCTOBER, 7);
		long dayDelta = 3;
		
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
		
		String expected = date.minusDays(dayDelta).format(formatter);
		
		/**
		 * -3をplusDaysの引数に渡すと3日前を指定したことになる。
		 * LocalDateを含めtimeパッケージの多くが不変なので
		 * 新しい変数でplusDaysなどの結果を受け取る必要がある。
		 */
		LocalDate beforeDate = date.plusDays(dayDelta * -1);
		String actual = beforeDate.format(formatter);
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void 地域を指定して夏時間を取得する(){
		ZoneId zoneId = ZoneId.of("Europe/Paris");
		boolean inSummerTime = zoneId.getRules().isDaylightSavings(Instant.now());
		/**
		 * 数値リテラルをlong型の変数に代入しておらず末尾にLを付与していない場合，
		 * long型と認識されずテストに失敗する。
		 * 
		 * ZoneIdの指す地域で夏時間(サマータイム)が実施中であるかどうかによって
		 * ZoneRules.isDaylightSavingsやZoneRules.getDaylightSavingsの結果は変化する。
		 */
		long summerTimeHours = inSummerTime ? 1L : 0L;
		long summerTimeMinutes = inSummerTime ? 60L : 0L;
			
		long summerTimeByHours = TimeZones.getSummerTime(zoneId, Duration::toHours);
		assertThat(summerTimeByHours, is(summerTimeHours));
		
		long summerTimeByMinutes = TimeZones.getSummerTime(zoneId, Duration::toMinutes);
		assertThat(summerTimeByMinutes, is(summerTimeMinutes));
		
		try {
			long summerTimeByHoursWithUnit = TimeZones.getSummerTime(zoneId, ChronoUnit.HOURS);
			assertThat(summerTimeByHoursWithUnit, is(summerTimeHours));

			long summerTimeByMinutesWithUnit = TimeZones.getSummerTime(zoneId, ChronoUnit.MINUTES);
			assertThat(summerTimeByMinutesWithUnit, is(summerTimeMinutes));
		} catch (UnsupportedTemporalTypeException ex) {
			/**
			 * Durationは時間ベースの時間の量を扱うクラスであり
			 * toHoursやtoMinutesなどのメソッドを持つが，getの引数に
			 * ChronoUnit.SECONDSとChronoUnit.NANOS以外を渡すと
			 * 実行時例外がスローされる。
			 * 
			 * ChronoUnitのようなTemporalUnitを実装したクラスを用いて
			 * 時間を得るのは危険なのかもしれない。しばしば直感に反する
			 * 実行時例外が発生する。
			 */
			System.err.println(ex.getMessage());
		}
	}
	
	@Test
	public void 任意の時刻を夏時間を考慮した時刻に変換する(){
		LocalDateTime localDateTime = LocalDateTime.of(2015, Month.OCTOBER, 22, 13, 22);
		ZoneId zoneId = ZoneId.of("Europe/Paris");
		ZonedDateTime zonedDateTime = ZonedDateTime.of(localDateTime, zoneId);
		long summerTimeHours = 1L;
		
		ZonedDateTime expected = ZonedDateTime.of(localDateTime.plusHours(summerTimeHours), zoneId);
		
		ZonedDateTime actual = TimeZones.withSummerTime(zonedDateTime);
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void 単位から時間量を得る(){
		TemporalUnit unit = ChronoUnit.WEEKS;
		
		long expected = 7;
		Duration duration = unit.getDuration();
		long actual = duration.toDays();
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void 任意の単位で時刻を切り取る(){
		LocalDateTime localDateTIme = LocalDateTime.of(2015, Month.SEPTEMBER, 11, 8, 2, 10);
		
		LocalDateTime expected = LocalDateTime.of(2015, Month.SEPTEMBER, 11, 8, 0, 0);
		/**
		 * LocalDateTime.truncatedToの引数に指定したTemporalUnit<em>以下</em>の単位が
		 * 対象のLocalDateTimeオブジェクトから切り捨てられる。
		 * 例えばHOURSを指定すると時分秒が切り捨てられる。
		 */
		LocalDateTime actual = localDateTIme.truncatedTo(ChronoUnit.HOURS);
		
		assertThat(actual, is(expected));
		
		DateTimeFormatter formatter = getPatternForTest();
		
		System.out.println(actual.format(formatter));
	}
	
	@Test
	public void ローカル時間を保持しつつタイムゾーンを変更する(){
		LocalDateTime sampleTime = LocalDateTime.of(2015, Month.SEPTEMBER, 9, 1, 0);
		ZoneId fromZonedId = ZoneId.ofOffset("GMT", ZoneOffset.ofHours(3));
		ZoneId toZonedId = ZoneId.of("Europe/Paris");
		
		ZonedDateTime fromZonedDateTime = ZonedDateTime.of(sampleTime, fromZonedId);
		ZonedDateTime toZoneDateTime = fromZonedDateTime.withZoneSameLocal(toZonedId);
		LocalDateTime actual = toZoneDateTime.toLocalDateTime();
		
		assertThat(actual, is(sampleTime));
	}
	
	@Test
	public void ロケールを指定して時刻を書式化する(){
		DateTimeFormatter formatter = DateTimeFormatter
			.ofLocalizedDateTime(FormatStyle.SHORT)
			.withLocale(Locale.JAPAN);
		
		String expected = "15/11/09 1:00";
		
		LocalDateTime time = LocalDateTime.of(2015, Month.NOVEMBER, 9, 1, 0);
		String actual = time.format(formatter);
		
		assertThat(actual, is(expected));
		
		System.out.println("short format : " + actual);
		
		/**
		 * 生成済みのDateTimeFormatterからFormatStyleだけ異なる
		 * 新しいDateTimeFoematterを生成することはできないようだ。
		 * DateTimeFormatter.getLocaleで書式設定時のLocaleは得られるが，
		 * 同じ要領でFormatStyleが得られるメソッドは存在しない。
		 */
		DateTimeFormatter mediumFormatter = DateTimeFormatter
			.ofLocalizedDate(FormatStyle.MEDIUM)
			.withLocale(Locale.JAPAN);
		DateTimeFormatter longFormatter = DateTimeFormatter
			.ofLocalizedDate(FormatStyle.LONG)
			.withLocale(Locale.JAPAN);
		DateTimeFormatter fullFormatter = DateTimeFormatter
			.ofLocalizedDate(FormatStyle.FULL)
			.withLocale(Locale.JAPAN);
		
		System.out.println("medium format : " + time.format(mediumFormatter));
		System.out.println("long format : " + time.format(longFormatter));
		System.out.println("full format : " + time.format(fullFormatter));
		
		System.out.println("formatter locale is " + formatter.getLocale());
	}
	
}
