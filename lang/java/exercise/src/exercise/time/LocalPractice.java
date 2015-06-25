package exercise.time;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;

public class LocalPractice {

	public static LocalDate lastDayOfMonth(LocalDate date){
		return date.with(TemporalAdjusters.lastDayOfMonth());
	}
	
}
