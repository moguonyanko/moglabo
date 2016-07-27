package practicejsf.bean;

import java.time.Month;
import java.time.format.TextStyle;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import javax.faces.bean.ApplicationScoped;
import javax.faces.bean.ManagedBean;

@ManagedBean
@ApplicationScoped
public class DateChoices {
	
	private final int[] days;
	private final int[] years;
	private final Map<String, Integer> months;
	
	public DateChoices() {
		days = IntStream.rangeClosed(1, 31).toArray();
		years = IntStream.rangeClosed(1900, 2100).toArray();
		
		months = Stream.of(Month.values())
			.collect(Collectors.toMap(m -> m.getDisplayName(TextStyle.FULL, Locale.getDefault()), 
				Month::getValue, 
				/**
				 * マージ関数では先に見つかった値を常に返している。しかし月を示す値が
				 * 衝突することはあり得ないのでマージの必要が発生することは無い。
				 */
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
	
}
