package exercise.time;

import java.time.DayOfWeek;

public class DayOfWeekPractice {
	
	private final DayOfWeek dayOfWeek;

	public DayOfWeekPractice(DayOfWeek dayOfWeek) {
		this.dayOfWeek = dayOfWeek;
	}
	
	public DayOfWeek next(){
		return dayOfWeek.plus(1);
	}
	
}
