package exercise.time;

import java.time.DayOfWeek;
import java.time.format.TextStyle;
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
	
	@Override
	public String toString(){
		return dayOfWeek.getDisplayName(textStyle, localle);
	}
	
}
