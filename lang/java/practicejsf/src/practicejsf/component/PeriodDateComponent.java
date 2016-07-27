package practicejsf.component;

import java.time.Month;
import java.time.format.TextStyle;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import javax.faces.component.FacesComponent;

@FacesComponent("practicejsf.component.DateComponent2")
public class PeriodDateComponent extends DateComponent {

	private final int[] days;
	
	private int[] years;
	private int startYear = 1900;
	private int endYear = 2100;
	
	private final Map<String, Integer> months;
	
	public PeriodDateComponent() {
		days = IntStream.rangeClosed(1, 31).toArray();
		years = IntStream.rangeClosed(startYear, endYear).toArray();
		
		months = Stream.of(Month.values())
			.collect(Collectors.toMap(m -> m.getDisplayName(TextStyle.FULL, Locale.getDefault()), 
				Month::getValue, 
				(firstMonthValue, secondMonthValue) -> firstMonthValue, 
				LinkedHashMap::new));
	}

	public int[] getDays() {
		return days;
	}

	public int[] getYears() {
		return years;
	}

	public Map<String, Integer> getMonths() {
		return new LinkedHashMap<>(months);
	}

	public int getStartYear() {
		return startYear;
	}

	public void setStartYear(int start) {
		startYear = start;
		years = IntStream.rangeClosed(start, endYear).toArray();
	}

	public int getEndYear() {
		return endYear;
	}
	
	public void setEndYear(int end) {
		endYear = end;
		years = IntStream.rangeClosed(startYear, end).toArray();
	}
	
}
