package exercise.time;

import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.time.temporal.ChronoField;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;

public class LocalDates {

	public static LocalDate lastDayOfMonth(LocalDate date){
		return date.with(TemporalAdjusters.lastDayOfMonth());
	}
	
	private static int getLengthOfYear(LocalDate date){
		Year year = Year.of(date.get(ChronoField.YEAR));
		int length = year.length();
		
		return length;
	}
	
	private static int getLengthOfYear(LocalDate start, LocalDate end){
		int dayLength = 0;
		
		/* 年から得られる日数 */
		int nowYear = start.getYear() + 1;
		int endYear = end.getYear();
		for(; nowYear < endYear; nowYear++){
			Year year = Year.of(nowYear);
			dayLength += year.length();
		}
		
		return dayLength;
	}
	
	private static int getLengthOfMonth(LocalDate start, LocalDate end){
		int dayLength = 0;
		
		/* 月から得られる日数 */
		boolean leapYear = end.isLeapYear();
		int nowMonth = start.getMonthValue();
		int endMonth = end.getMonthValue();
		for(; nowMonth <= endMonth; nowMonth++){
			Month month = Month.of(nowMonth);
			dayLength += month.length(leapYear);
		}
		
		return dayLength;
	}
	
	private static LocalDate withDate(LocalDate start, LocalDate end){
		/**
		 * LocalDate.withで引数の日付に基づいて調整されたLocalDateを得る。
		 */
		LocalDate date = start.with(end);
		
		return date;
	}
	
	public static long toTotalDays(LocalDate start, LocalDate end){
		return ChronoUnit.DAYS.between(start, end);
	}
	
}
