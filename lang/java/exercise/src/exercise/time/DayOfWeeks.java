package exercise.time;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.time.temporal.TemporalAdjusters;
import java.util.Locale;

public class DayOfWeeks {
	
	private static final TextStyle DEFAULT_TEXTSTYLE = TextStyle.FULL;
	private static final Locale DEFAULT_LOCALE = Locale.getDefault();
	
	private final DayOfWeek dayOfWeek;
	private final TextStyle textStyle;
	private final Locale localle;
	
	public DayOfWeeks(DayOfWeek dayOfWeek) {
		this(dayOfWeek, DEFAULT_TEXTSTYLE, DEFAULT_LOCALE);
	}

	public DayOfWeeks(DayOfWeek dayOfWeek, TextStyle textStyle) {
		this(dayOfWeek, textStyle, DEFAULT_LOCALE);
	}

	public DayOfWeeks(DayOfWeek dayOfWeek, TextStyle textStyle, 
		Locale locale) {
		this.dayOfWeek = dayOfWeek;
		this.textStyle = textStyle;
		this.localle = locale;
	}
	
	public DayOfWeek next(){
		return dayOfWeek.plus(1);
	}
	
	public static LocalDate nextDate(LocalDate nowDate, DayOfWeek dayOfWeek){
		return nowDate.with(TemporalAdjusters.next(dayOfWeek));
	}
	
	@Override
	public String toString(){
		return dayOfWeek.getDisplayName(textStyle, localle);
	}
	
}
