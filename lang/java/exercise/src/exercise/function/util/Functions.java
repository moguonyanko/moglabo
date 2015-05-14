package exercise.function.util;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;
import java.util.stream.Collectors;

public class Functions {

	private static final Function<String, Predicate<String>> equalsIgnoreCaseString
		= target -> source -> source.equalsIgnoreCase(target);

	/**
	 * 型を動的に決定させたい時はフィールドではなくメソッドを使う。
	 */
	private static <T> Predicate<T> getEqualsPredicate(T target) {
		Predicate<T> predicate = source -> source.equals(target);
		return predicate;
	}

	public static <T> void dump(Collection<T> targets, Consumer<? super T> dumpAction) {
		targets.forEach(dumpAction::accept);
	}

	public static <T> List<T> modifyStrings(List<T> targets,
		Function<T, T> action) {
		List<T> result = targets.stream().
			map(action).collect(Collectors.toList());

		return result;
	}

	public static List<String> toUpperCases(List<String> targets) {
		return modifyStrings(targets, String::toUpperCase);
	}

	public static List<String> toLowerCases(List<String> targets) {
		return modifyStrings(targets, String::toLowerCase);
	}

	public static <T> Collection<T> extract(Collection<T> sources, T target) {
		Collection<T> result = sources.stream().
			filter(source -> source.equals(target)).
			collect(Collectors.toList());

		return result;
	}

	public static String findIgnoreCase(Collection<String> sources, String target) {
		Optional<String> result = sources.stream().
			filter(equalsIgnoreCaseString.apply(target)).
			findFirst();

		return result.get();
	}

	public static List<String> findAllIgnoreCase(List<String> sources, String target) {
		List<String> result = sources.stream().
			filter(equalsIgnoreCaseString.apply(target)).
			collect(Collectors.toList());

		return result;
	}

	public static <T> T maxElement(Collection<T> sources, Function<T, Integer> action) {
		Optional<T> result = sources.stream().
			reduce((el1, el2) -> action.apply(el1) >= action.apply(el2) ? el1 : el2);

		return result.get();
	}

	public static String join(Collection<String> sources, String separator,
		Function<String, String> action) {
		String result = sources.stream().
			map(action).collect(Collectors.joining(separator));

		return result;
	}

	public static <T, C extends Collection> Collection<T> sorted(Collection<T> sources, 
		Comparator<T> comparator, Supplier<C> supplier) {
		Collection<T> result = sources.stream().
			sorted(comparator).
			collect(Collectors.toCollection(supplier));

		return result;
	}
	
	public static <T> Collection<T> sorted(Collection<T> sources, 
		Comparator<T> comparator) {
		/**
		 * @todo
		 * sortedメソッド第3引数のSupplierを引数のCollectionから得る方法は無いか？
		 * 
		 */
		return sorted(sources, comparator, ArrayList::new);
	}
	
	public static <T> Collection<T> reverseSorted(Collection<T> sources, 
		Comparator<T> comparator) {
		return sorted(sources, comparator.reversed(), ArrayList::new);
	}
	
	public static <T> T minElement(Collection<T> sources, Comparator<T> comparator) {
		T result = sources.stream().
			min(comparator).get();

		return result;
	}
	
	public static <T> T maxElement(Collection<T> sources, Comparator<T> comparator) {
		T result = sources.stream().
			max(comparator).get();

		return result;
	}
	
	public static <T, C extends Collection> Collection<T> sorted(Collection<T> sources, 
		Collection<Comparator<T>> comparators, Supplier<C> supplier) {
		/**
		 * @todo
		 * コンパレータを縮約して最終的に必要なコンパレータを得る。
		 */
		
		return null;
	}
}
