package exercise.function.util;

import java.util.Collection;
import java.util.List;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.stream.Collectors;

public class Functions {

	public static <T> void dump(Collection<T> targets, Consumer<? super T> dumpAction) {
		targets.forEach(dumpAction::accept);
	}
	
	public static <T> List<T> modifyStrings(List<T> targets, 
		Function<T, T> action){
		List<T> result = targets.stream().
			map(action).collect(Collectors.toList());
		
		return result;
	}
	
	public static List<String> toUpperCases(List<String> targets){
		return modifyStrings(targets, String::toUpperCase);
	}
	
	public static List<String> toLowerCases(List<String> targets){
		return modifyStrings(targets, String::toLowerCase);
	}
	
	public static <T> Collection<T> extract(Collection<T> sources, T target){
		Collection<T> result = sources.stream().
			filter(source -> source.equals(target)).
			collect(Collectors.toList());
		
		return result;
	}
}
