package exercise.function.util;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

public class Functions {
	
	private static final Function<String, Predicate<String>> equalsIgnoreCaseString = 
		target -> source -> source.equalsIgnoreCase(target);
	
	/**
	 * 型を動的に決定させたい時はフィールドではなくメソッドを使う。
	 */
	private static <T> Predicate<T> getEqualsPredicate(T target){
		Predicate<T> predicate = source -> source.equals(target);
		return predicate;
	}

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
	
	public static String findIgnoreCase(Collection<String> sources, String target){
		Optional<String> result = sources.stream().
			filter(equalsIgnoreCaseString.apply(target)).
			findFirst();
		
		return result.get();
	}
	
	public static List<String> findAllIgnoreCase(List<String> sources, String target){
		List<String> result = sources.stream().
			filter(equalsIgnoreCaseString.apply(target)).
			collect(Collectors.toList());
		
		return result;
	}
}
