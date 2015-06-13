package exercise.function.util;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.BinaryOperator;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;
import java.util.function.ToDoubleFunction;
import java.util.function.ToLongFunction;
import java.util.function.UnaryOperator;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Pattern;
import java.util.stream.Stream;
import static java.util.stream.Collectors.*;

public class Functions {

	private static final Function<String, Predicate<String>> equalsIgnoreCaseString
		= target -> source -> source.equalsIgnoreCase(target);

	private static final Pattern CHAR_BOUNDS = Pattern.compile("\\B");

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
			map(action).collect(toList());

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
			collect(toList());

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
			collect(toList());

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
			map(action).collect(joining(separator));

		return result;
	}

	public static <T, C extends Collection> Collection<T> sorted(Collection<T> sources,
		Comparator<T> comparator, Supplier<C> supplier) {
		Collection<T> result = sources.stream().
			sorted(comparator).
			collect(toCollection(supplier));

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
		if (!comparators.iterator().hasNext()) {
			return sources;
		}

		Comparator<T> firstComparator = comparators.iterator().next();

		Comparator<T> comparator = comparators.stream().
			reduce(firstComparator, (c1, c2) -> c1.thenComparing(c2));

		return sorted(sources, comparator, supplier);
	}

	public static <T, U> Map<U, List<T>> groupBy(Collection<T> sources, Function<T, U> classifier) {
		Map<U, List<T>> result = sources.stream().
			collect(groupingBy(classifier));

		return result;
	}

	public static <T, U, V> Map<U, List<V>> groupBy(Collection<T> sources, Function<T, U> classifier,
		Function<T, V> mapper) {
		Map<U, List<V>> result = sources.stream().
			collect(groupingBy(classifier, mapping(mapper, toList())));

		return result;
	}

	public static <T, U, V> Map<U, T> groupBy(Collection<T> sources, Function<T, U> classifier,
		Comparator<T> comparator, T identify, BinaryOperator<T> op) {
		/**
		 * Optionalオブジェクトをクライアント側に返さないようにidentifyを使っている。
		 */
		Map<U, T> result = sources.stream().
			collect(groupingBy(classifier, reducing(identify, op)));

		return result;
	}

	public static <T, U, V> Map<U, T> minGroupBy(Collection<T> sources, Function<T, U> classifier,
		Comparator<T> comparator, T identify) {
		return groupBy(sources, classifier, comparator, identify, BinaryOperator.minBy(comparator));
	}

	public static <T, U, V> Map<U, T> maxGroupBy(Collection<T> sources, Function<T, U> classifier,
		Comparator<T> comparator, T identify) {
		return groupBy(sources, classifier, comparator, identify, BinaryOperator.maxBy(comparator));
	}

	public static void comsumePath(Path path, Consumer<Path> consumer) throws IOException {
		Files.list(path).forEach(consumer);
	}

	public static List<Path> collectPaths(Path path, Predicate<Path> predicate)
		throws IOException {
		List<Path> result = Files.list(path).filter(predicate).collect(toList());

		return result;
	}

	public static List<File> collectFiles(Path path, Predicate<File> predicate)
		throws IOException {
		List<File> result = Stream.of(path.toFile().listFiles())
			.flatMap(file -> predicate.test(file)
				? Stream.of(file)
				: Stream.of(file.listFiles()))
			.collect(toList());

		return result;
	}

	/**
	 * @param <T>
	 * @param sources
	 * @param predicate
	 * @param mapper
	 * @return 
	 * @todo
	 * mapToLongとmapToDouble以外は同じ。統一したい。
	 *
	 */
	public static <T> long sum(Collection<T> sources,
		Predicate<T> predicate, ToLongFunction<T> mapper) {
		long result = sources.stream()
			.filter(predicate)
			.mapToLong(mapper)
			.sum();

		return result;
	}

	public static <T> double sum(Collection<T> sources,
		Predicate<T> predicate, ToDoubleFunction<T> mapper) {
		double result = sources.stream()
			.filter(predicate)
			.mapToDouble(mapper)
			.sum();

		return result;
	}

	public static <T> T getDecoratedValue(T target, Function<T, T>... decoraters) {
		/**
		 * setterを持ったオブジェクトはgetDecoratedValueのようなメソッドで
		 * まとめてsetterを呼び出すことにより，setterの呼び忘れや呼ぶ順序を
		 * 意識させられることを避けられる。
		 */
		Function<T, T> reducedDecorator = Stream.of(decoraters)
			.reduce((decorator, nextDecorator) -> decorator.compose(nextDecorator))
			.orElseGet(Function::identity);

		return reducedDecorator.apply(target);
	}

	public static <T, R, X extends Exception> boolean assertThrows(Class<X> targetException,
		Function<T, R> function, T argument) {
		try {
			function.apply(argument);
		} catch (Exception ex) {
			return targetException.isInstance(ex);
		}

		throw new IllegalArgumentException("Not throws exception. Check arguments.");
	}

	public static class DelayCacheSupplier<T> implements Supplier<T> {

		private final T heavyObject;

		public DelayCacheSupplier(Supplier<T> supplier) {
			this.heavyObject = supplier.get();
		}

		@Override
		public T get() {
			return heavyObject;
		}
	}

	public static <T> Supplier<T> getDelayCacheSupplier(Supplier<T> supplier) {
		return new DelayCacheSupplier(supplier);
	}

	/**
	 * @todo
	 * 引数の型をTで固定しないようにしたい。
	 *
	 * @param <T>
	 * @param predicates
	 * @return
	 */
	public static <T> boolean allMatchPredidates(Predicate<T>... predicates) {
		/**
		 * Stream::allMatchはfalseが返された時点で残りの述語の評価を中止し
		 * 評価結果を返す。
		 * このメソッドは述語の引数を受け取っていないのでPredicate::testの引数は
		 * nullになっている。
		 */
		return Stream.of(predicates).allMatch(p -> p.test(null));
	}

	public static <T, C extends Collection> Collection<T> collectValues(
		T seed, UnaryOperator<T> nextValueOperator, int limitSize, Supplier<C> supplier) {
		Collection<T> result = Stream.iterate(seed, nextValueOperator)
			.limit(limitSize)
			.collect(toCollection(supplier));

		return result;
	}

	public static <T, C extends Collection> Collection<T> collectValues(
		T seed, UnaryOperator<T> nextValueOperator, int limitSize) {
		return collectValues(seed, nextValueOperator, limitSize, ArrayList::new);
	}

	/**
	 * @param sources
	 * @param cs
	 * @param condition
	 * @return 
	 * @throws java.io.IOException
	 * @todo
	 * 関数型のスタイルで書き直し並列化する。
	 */
	public static String countWord(Collection<Path> sources, Charset cs, 
		Predicate<Integer> condition) throws IOException {
		Map<String, Integer> dict = new HashMap<>();
		for(Path src : sources){
			for (String line : Files.readAllLines(src, cs)) {
				String[] words = CHAR_BOUNDS.split(line);
				for (String word : words) {
					if (dict.containsKey(word)) {
						dict.put(word, dict.get(word) + 1);
					} else {
						dict.put(word, 1);
					}
				}
			}
		}

		String maxCountWord = "";
		int maxCount = 0;
		for (String key : dict.keySet()) {
			Integer count = dict.get(key);
			if (count > maxCount && condition.test(count)) {
				maxCountWord = key;
				maxCount = dict.get(key);
			}
		}

		return maxCountWord;
	}

}
