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
import java.util.PrimitiveIterator.OfInt;
import java.util.function.BiFunction;
import java.util.function.BinaryOperator;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;
import java.util.function.ToDoubleFunction;
import java.util.function.ToLongFunction;
import java.util.function.UnaryOperator;
import java.util.regex.Pattern;
import java.util.stream.Stream;
import static java.util.stream.Collectors.*;
import java.util.stream.IntStream;

/**
 * 参考：
 * 「Javaによる関数型プログラミング」(オライリー・ジャパン)
 * 「アルゴリズムとデータ構造」(SoftbankCreative)
 */
public class Functions {

	private static final Function<String, Predicate<String>> equalsIgnoreCaseString
		= target -> source -> source.equalsIgnoreCase(target);

	private static final Pattern WORD_BOUNDS = Pattern.compile("\\s+");

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

	public static <T, C extends Collection<T>> C sorted(Collection<T> sources,
		Comparator<T> comparator, Supplier<C> supplier) {
		C result = sources.stream().
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

	private static class WordCounter {

		private final Map<String, Integer> dict;

		public WordCounter(Map<String, Integer> dict) {
			this.dict = dict;
		}

		public WordCounter() {
			this(new HashMap<>());
		}

		private void countWordInLine(String line) {
			Stream.of(WORD_BOUNDS.split(line))
				.forEach(word -> dict.put(word, dict.getOrDefault(word, 0) + 1));
		}

		private WordCounter countWord(Path path, Charset cs) {
			try {
				if (path != null) {
					/**
					 * WordCounter::countWordInLineはWordCounterクラスの外から
					 * countWordInLineメソッドを参照するときの記述方法なので
					 * ここではシンタックスエラーになる。
					 */
					Files.lines(path, cs).forEach(this::countWordInLine);
				}

				return this;
			} catch (IOException ex) {
				throw new IllegalStateException(ex.getMessage());
			}
		}

		public Map<String, Integer> getResult() {
			return new HashMap<>(dict);
		}
	}

	private static WordCounter mergeCounter(WordCounter base, WordCounter other) {
		Map<String, Integer> baseResult = new HashMap<>(base.getResult());

		/* key, value, result の3つの型変数が必要。 */
		BiFunction<String, Integer, Integer> mergeFn = (word, baseCount) -> {
			int newCount = baseResult.getOrDefault(word, 0) + other.getResult().get(word);
			return baseResult.put(word, newCount);
		};

		other.getResult().keySet().stream()
			.forEach(wd -> baseResult.compute(wd, mergeFn));

		return new WordCounter(baseResult);
	}

	/**
	 * パスの集合で参照されるファイル群を調べます。そして引数の述語を満たし
	 * 最も多く現れる単語を返します。
	 * ファイル群の文字エンコーディングは統一されている必要があります。
	 * 英文にしか対応していません。
	 *
	 * @param sources
	 * @param cs
	 * @param condition
	 * @return
	 *
	 */
	public static String countWord(Collection<Path> sources, Charset cs,
		Predicate<String> condition, Supplier<String> defaultWordSupplier) {
		Map<String, Integer> allResult = sources.parallelStream()
			.map(src -> new WordCounter().countWord(src, cs))
			.reduce(new WordCounter(), Functions::mergeCounter)
			.getResult();

		BinaryOperator<String> moreCountWord = (word, next)
			-> allResult.getOrDefault(word, 0) < allResult.getOrDefault(next, 0)
			? next : word;

		String maxCountWord = allResult.keySet().parallelStream()
			.filter(condition::test)
			.reduce(moreCountWord)
			.orElseGet(defaultWordSupplier);

		return maxCountWord;
	}

	public static String countWord(Collection<Path> sources, Charset cs,
		Predicate<String> condition) {
		return countWord(sources, cs, condition, String::new);
	}

	public static String countWord(Collection<Path> sources, Charset cs,
		Predicate<String> condition, String defaultWord) {
		return countWord(sources, cs, condition, () -> defaultWord);
	}

	public static String countWord(Collection<Path> sources, Charset cs) {
		return countWord(sources, cs, word -> true);
	}

	private static Node dfs(Node node) {
		node.setColor(NodeColor.GRAY);

		node.getNodes().stream()
			.filter(n -> n.getColor() == NodeColor.WHITE)
			.forEach(n -> dfs(n));

		node.setColor(NodeColor.BLACK);

		return node;
	}

	public static Node depthFirstSearch(Node root) {
		return dfs(root);
	}

	private static <T extends Comparable> void quickSortProcess(
		int bottom, int top, List<T> data) {
		int lower, upper;

		if (bottom >= top) {
			return;
		}

		T div = data.get(bottom);

		for (lower = bottom, upper = top; lower < upper;) {
			while (lower <= upper && data.get(lower).compareTo(div) <= 0) {
				lower++;
			}
			while (lower <= upper && data.get(upper).compareTo(div) > 0) {
				upper--;
			}
			if (lower < upper) {
				T temp = data.get(lower);
				data.set(lower, data.get(upper));
				data.set(upper, temp);
			}
		}

		T tmp = data.get(bottom);
		data.set(bottom, data.get(upper));
		data.set(upper, tmp);

		quickSortProcess(bottom, upper - 1, data);
		quickSortProcess(upper + 1, top, data);
	}

	public static <T extends Comparable, C extends Collection<T>> C
		quickSort(Collection<T> src, Supplier<C> supplier) {
		List<T> data = new ArrayList(src);

		quickSortProcess(0, src.size() - 1, data);

		C result = data.stream()
			.collect(toCollection(supplier));

		return result;
	}
		
	private static <T extends Comparable> void mergeSortProcess(int dataSize, 
		List<T> data, int offset){
		if(dataSize <= 1){
			return;
		}
		
		int divSize = dataSize / 2;
		
		mergeSortProcess(divSize, data, offset);
		mergeSortProcess(dataSize - divSize, data, offset + divSize);
		
		/**
		 * 終了条件や継続条件に関わる値が不変でないと関数インターフェースを
		 * 利用した記述を行うのは難しい。
		 */
		
		List<T> buffer = new ArrayList<>(divSize);
		for(int bufIdx = 0; bufIdx < divSize; ++bufIdx){
			buffer.add(bufIdx, data.get(offset + bufIdx));
		}
		
		int lhsIdx = 0;
		int rhsIdx = divSize;
		int bufIdx = 0;
		
		while(lhsIdx < divSize && rhsIdx < dataSize){
			if(buffer.get(lhsIdx).compareTo(data.get(offset + rhsIdx)) <= 0){
				data.set(offset + bufIdx, buffer.get(lhsIdx));
				lhsIdx++;
			}else{
				data.set(offset + bufIdx, data.get(offset + rhsIdx));
				rhsIdx++;
			}
			bufIdx++;
		}
		
		while(lhsIdx < divSize){
			data.set(offset + bufIdx, buffer.get(lhsIdx));
			bufIdx++;
			lhsIdx++;
		}
	}

	public static <T extends Comparable, C extends Collection<T>> C
		mergeSort(Collection<T> src, Supplier<C> supplier) {
		List<T> data = new ArrayList<>(src);
			
		mergeSortProcess(data.size(), data, 0);
		
		C result = data.stream()
			.collect(toCollection(supplier));
		
		return result;
	}
		
	private static <T extends Comparable> void insertSortProcess(List<T> data){
		for(int sorted = 0, size = data.size(); sorted < size - 1; ++sorted){
			T insertElement = data.get(sorted + 1);
			int i;
			
			/**
			 * @todo
			 * 以下のラムダ式を用いた記述では正しくソートされない。
			 */
//			int sortedIdx = sorted;
//			T t = data.stream()
//				.filter(el -> el.compareTo(data.get(sortedIdx + 1)) > 0)
//				.findFirst()
//				.orElse(null);
//			int i = t != null ? data.indexOf(t) : sorted;
			
			for(i = 0; i <= sorted; ++i){
				if(data.get(i).compareTo(insertElement) > 0){
					break;
				}
			}
			
			while(i <= sorted + 1){
				T temp = data.get(i);
				data.set(i, insertElement);
				insertElement = temp;
				++i;
			}
		}
	}	
		
	public static <T extends Comparable, C extends Collection<T>> C
		insertSort(Collection<T> src, Supplier<C> supplier) {
		List<T> data = new ArrayList<>(src);
			
		insertSortProcess(data);
		
		C result = data.stream()
			.collect(toCollection(supplier));
		
		return result;
	}
		
}
