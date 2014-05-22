package exercise.time;

import java.time.DayOfWeek;
import java.time.format.TextStyle;
import java.util.Locale;

public class DayOfWeekPractice {
	
	private static final TextStyle defaultTextStyle = TextStyle.FULL;;
	private static final Locale defaultLocale = Locale.getDefault();
	
	private final DayOfWeek dayOfWeek;
	private final TextStyle textStyle;
	private final Locale localle;
	
	public DayOfWeekPractice(DayOfWeek dayOfWeek) {
		this(dayOfWeek, defaultTextStyle, defaultLocale);
	}

	public DayOfWeekPractice(DayOfWeek dayOfWeek, TextStyle textStyle) {
		this(dayOfWeek, textStyle, defaultLocale);
	}

	public DayOfWeekPractice(DayOfWeek dayOfWeek, TextStyle textStyle, 
		Locale locale) {
		this.dayOfWeek = dayOfWeek;
		this.textStyle = textStyle;
		this.localle = locale;
	}
	
	public DayOfWeek next(){
		return dayOfWeek.plus(1);
	}
	
	@Override
	public String toString(){
		return dayOfWeek.getDisplayName(textStyle, localle);
	}
}
