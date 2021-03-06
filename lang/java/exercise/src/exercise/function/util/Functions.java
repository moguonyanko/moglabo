package exercise.function.util;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.FileVisitOption;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.function.BiFunction;
import java.util.function.BiPredicate;
import java.util.function.BinaryOperator;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;
import java.util.function.ToDoubleFunction;
import java.util.function.ToIntFunction;
import java.util.function.ToLongFunction;
import java.util.function.UnaryOperator;
import java.util.regex.Pattern;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.IntStream;
import static java.util.stream.Collectors.*;

/**
 * 参考：
 * 「Javaによる関数型プログラミング」(オライリー・ジャパン)
 * 「アルゴリズムとデータ構造」(SoftbankCreative)
 * 「Land of Lisp」(オライリー・ジャパン)
 * 「ANSI Common Lisp」(ピアソン)
 * 「計算機プログラムの構造と解釈 第2版」（ピアソン）
 * 「javaScript(第6版)」(オライリー・ジャパン)
 * 「Effective Java 第2版」(ピアソン)
 * 「Java Tutorial」(オラクル)
 */
public class Functions {

	private static final Function<String, Predicate<String>> EQUALSIGNORECASE_STRING
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
			filter(EQUALSIGNORECASE_STRING.apply(target)).
			findFirst();

		return result.get();
	}

	public static List<String> findAllIgnoreCase(List<String> sources, String target) {
		List<String> result = sources.stream().
			filter(EQUALSIGNORECASE_STRING.apply(target)).
			collect(toList());

		return result;
	}

	public static <T> T maxElement(Collection<T> sources, Function<T, Integer> action) {
		Optional<T> result = sources.stream().
			reduce((el1, el2) -> action.apply(el1) >= action.apply(el2) ? el1 : el2);

		return result.get();
	}

	public static <T extends CharSequence, C extends Collection<T>> String 
		join(C sources, T separator, Function<T, T> action) {
		String result = sources.stream().
			map(action).collect(joining(separator));

		return result;
	}
	
	public static <T extends CharSequence, C extends Collection<T>> String
		join(C sources, T separator) {
		return join(sources, separator, Function.identity());
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
	
	public static <T, U extends Comparable<? super U>, C extends Collection<T>>
		C sorted(C src, Function<? super T, ? extends U> keyExtractor, Supplier<C> supplier){
		/**
		 * 型変数宣言でUがComparableをextendsしていないと以下の行は
		 * コンパイルエラーになる。そうでないとComparableな(比較可能な)
		 * キーを返すFunctionがComparator.comparingに渡されることが
		 * 保証されないためだと思われる。
		 */
		//Comparator<T> comparator = Comparator.comparing(keyExtractor);
		
		C result = src.stream()
			.sorted(Comparator.comparing(keyExtractor))
			.collect(toCollection(supplier));
		
		return result;
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
		T identify, BinaryOperator<T> op) {
		/**
		 * Optionalオブジェクトをクライアント側に返さないようにidentifyを使っている。
		 */
		Map<U, T> result = sources.stream().
			collect(groupingBy(classifier, reducing(identify, op)));

		return result;
	}

	public static <T, U, V> Map<U, T> minGroupBy(Collection<T> sources, Function<T, U> classifier,
		Comparator<T> comparator, T identify) {
		return groupBy(sources, classifier, identify, BinaryOperator.minBy(comparator));
	}

	public static <T, U, V> Map<U, T> maxGroupBy(Collection<T> sources, Function<T, U> classifier,
		Comparator<T> comparator, T identify) {
		return groupBy(sources, classifier, identify, BinaryOperator.maxBy(comparator));
	}

	public static void comsumePath(Path path, Consumer<Path> consumer) throws IOException {
		try(Stream<Path> stream = Files.list(path)){
			stream.forEach(consumer);
		}
	}

	public static List<Path> collectPaths(Path path, Predicate<Path> predicate)
		throws IOException {
		List<Path> result;
		
		try(Stream<Path> stream = Files.list(path)){
			result = stream.filter(predicate).collect(toList());
		}

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

	public static <T> int sum(Collection<T> src, ToIntFunction<T> func){
		int result = src.stream()
			.collect(summingInt(func));
		
		return result;
	}
	
	public static <T extends Integer> int ranegClosedSum(T start, T end) {
		if (start.intValue() > end.intValue()) {
			throw new IllegalArgumentException("start must be less than end");
		}

		/**
		 * IntStreamはStreamのサブインターフェースではない。従って
		 * IntStreamからStreamを得るにはboxed等による変換処理が必要になる。
		 */
		Stream<Integer> stream = IntStream.rangeClosed(start, end).boxed();
		Collector<Integer, ?, Integer> collector
			= Collectors.reducing(0, (a, b) -> a + b);

		return stream.collect(collector);
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

	public static <T, C extends Collection<T>> Collection<T> collectValues(
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
					try(Stream<String> stream = Files.lines(path, cs)){
						stream.forEach(this::countWordInLine);
					}
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
            // Java(build 9+181)ではcompute実行時にConcurrentModificationExceptionとなる。
			//.forEach(wd -> baseResult.compute(wd, mergeFn));
			.forEach(wd -> {
            if (baseResult.containsKey(wd)) {
                int oldCount = baseResult.get(wd);
                int newCount = oldCount + other.getResult().get(wd);
                baseResult.put(wd, newCount);
            } else {
                baseResult.put(wd, 1);
            }
        });

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
		Map<String, Integer> allResult = sources.stream()
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
		List<T> data, int offset) {
		if (dataSize <= 1) {
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
		for (int bufIdx = 0; bufIdx < divSize; ++bufIdx) {
			buffer.add(bufIdx, data.get(offset + bufIdx));
		}

		int lhsIdx = 0;
		int rhsIdx = divSize;
		int bufIdx = 0;

		while (lhsIdx < divSize && rhsIdx < dataSize) {
			if (buffer.get(lhsIdx).compareTo(data.get(offset + rhsIdx)) <= 0) {
				data.set(offset + bufIdx, buffer.get(lhsIdx));
				lhsIdx++;
			} else {
				data.set(offset + bufIdx, data.get(offset + rhsIdx));
				rhsIdx++;
			}
			bufIdx++;
		}

		while (lhsIdx < divSize) {
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

	private static <T extends Comparable> void insertSortProcess(List<T> data) {
		for (int sorted = 0, size = data.size(); sorted < size - 1; sorted++) {
			int now = sorted + 1;
			int next = now + 1;
			T insertElement = data.get(now);

			T t = insertElement;
			Optional opt = data.stream()
				.filter(el -> el.compareTo(t) > 0)
				.findFirst();

			/**
			 * ソート済みだった場合はnextが代入され挿入処理が行われない。
			 */
			int insertIdx = opt.isPresent() ? data.indexOf(opt.get()) : next;

//			int insertIdx;
//			for(insertIdx = 0; insertIdx <= sorted; ++insertIdx){
//				if(data.get(insertIdx).compareTo(insertElement) > 0){
//					break;
//				}
//			}
			while (insertIdx <= now) {
				T temp = data.get(insertIdx);
				data.set(insertIdx, insertElement);
				insertElement = temp;
				insertIdx++;
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

	/**
	 * 参考：
	 * Josh Bloch氏の2015/07/21のツイート
	 */
	public static void printlnIntergers(Collection<Integer> sample) {
		sample.stream()
			.map(i -> i.toString())
			/**
			 * ObjectのインスタンスメソッドのtoStringと
			 * IntegerのstaticメソッドのtoStringの2つのうち
			 * どちらを呼び出すかが特定できないのでコンパイルエラーになる。
			 */
			//.map(Integer::toString) 
			.forEach(s -> {
				System.out.println(s.charAt(0));
			});
	}

	/**
	 * @todo
	 * Supplierを引数で受け取らず，srcを元にして得るようにしたい。
	 */
	public static <T, C extends Collection<T>> C mapcar(
		Function<T, T> mapper,
		C src, Supplier<C> supplier) {
		C result = src.stream()
			.map(mapper)
			.collect(toCollection(supplier));

		return result;
	}

	public static <T, C extends Collection<T>> C mapcan(
		Function<T, C> mapper,
		C src, Supplier<C> supplier) {
		C result = src.stream()
			.map(mapper)
			.reduce(supplier.get(), (now, next) -> {
				now.addAll(next);
				return now;
			});

		return result;
	}

	private static <T> boolean hasMultiElements(Collection<T> src) {
		/**
		 * 1番目の要素を除外したStreamを得て，その最初の要素が
		 * 存在するならば少なくとも2つ以上要素を持つコレクションである。
		 * 要素がnullでないかどうかをチェックする方法では，意図的にnullを含む
		 * コレクションで誤判定が発生する可能性がある。
		 *
		 * skipメソッドは<em>順序付けされた並列パイプライン</em>では
		 * パフォーマンスが悪くなる可能性がある。
		 *
		 */
		boolean hasMulti = src.stream()
			.skip(1)
			.findFirst()
			.isPresent();

		return hasMulti;
	}

	private static <T> boolean notEmptyCollection(Collection<T> src) {
		/**
		 * 1番目の要素だけ含むStreamを得て，その最初の要素が
		 * 存在するならば空のコレクションではない。
		 *
		 * limitメソッドは<em>順序付けされた並列パイプライン</em>では
		 * パフォーマンスが悪くなる可能性がある。
		 *
		 */
		boolean notEmpty = src.stream()
			.limit(1)
			.findFirst()
			.isPresent();

		return notEmpty;
	}

	/**
	 * コレクションが要素を1つだけ持つかどうかを調べる。
	 * 学習のため，以下に示す制約に従って実装している。
	 *
	 * <ul>
	 * <li>sizeやcount, isEmptyといった要素の数を調べる既存のメソッドを使わないこと。</li>
	 * <li>自分で数えないこと。</li>
	 * <li>例外を使わないこと。</li>
	 * </ul>
	 */
	public static <T> boolean isSingle(Collection<T> src) {
		/**
		 * 要素を1つだけ持つコレクションとは，要素を複数持たない
		 * かつ空ではないコレクションである。
		 */
		return !hasMultiElements(src) && notEmptyCollection(src);
	}

	public static <T, R> BiFunction toBiFunction(Function<T, R> f) {
		BiFunction<Function<T, R>, T, R> bfn
			= (func, arg) -> func.apply(arg);

		return bfn;
	}

	public static <T> Stream<T> map(Stream<T> stream, Function<T, T> func) {
		return stream.map(func);
	}

	public static <T> Stream<T> select(Stream<T> stream, Predicate<T> pred) {
		return stream.filter(pred);
	}

	public static <T, R, C extends Collection<R>> R most(Collection<T> src,
		Function<? super T, ? extends C> mapper, R defaultValue) {
		/**
		 * クライアントにStreamを生成する手間を掛けさせたくないので
		 * flatMapの引数でStreamを生成している。
		 *
		 * クライアントが引数をメソッド参照で渡せるようにAPIを設計することが重要である。
		 * Streamは中間状態でありStreamを扱うAPIは中間操作である。従ってそれらを
		 * クライアントが意識する必要があるようなAPI設計は避けるべきである。
		 *
		 * flapMapはコレクションの各要素に含まれるコレクションを
		 * Streamで得るためのショートカットと考えられる。
		 * 
		 * eleCounter変数を得る終端操作のStream.collectでは現在のコレクションの
		 * 状態に応じて値を決定しているため，Collectors.toConcurrentMapを使うように
		 * 記述できない。
		 * 
		 * mapper.applyの戻り値となるコレクションが
		 * Collector.Characteristics.UNORDERED特性を持っているかどうか
		 * 分からないので，flatMapの引数でBaseStream.unordered()を呼び出して
		 * ストリームが順序付けされないようにしている。ただしその後の
		 * collectの第1引数にConcurrentHashMap::newを渡しているので，
		 * コレクタがCollector.Characteristics.UNORDERED特性を持つかもしれない。
		 * もしそうであるならばBaseStream.unordered()を呼び出す必要は無い。
		 * 
		 * srcに対してCollection.parallelStreamを呼び出すと，このメソッドは
		 * 誤った結果を返すことがある。今のところsrcが並行性をサポートする
		 * コレクションであっても同じように問題は発生する。
		 * APIの柔軟性を維持するためにsrcの型をCollection<T>と宣言している。即ち
		 * 並行性をサポートするコレクション型で宣言するべきではない。
		 */
		Map<R, Integer> eleCounter = src.stream()
			.flatMap(t -> mapper.apply(t).parallelStream().unordered())
			.collect(ConcurrentHashMap::new, 
				(m, r) -> m.put(r, m.getOrDefault(r, 0) + 1), 
				ConcurrentHashMap::putAll);

		BinaryOperator<R> moreElementAccumlator
			= (a, b) -> eleCounter.getOrDefault(a, 0) > eleCounter.getOrDefault(b, 0)
			? a : b;

		/**
		 * reduceの第1引数としてidentityを渡す場合，その値は累積関数の
		 * 単位元でなければならない。これはデフォルト値とは異なる場合がある。
		 */
		R result = eleCounter.keySet().parallelStream()
			.reduce(moreElementAccumlator)
			.orElse(defaultValue);

		return result;
	}

	public static <T extends Collection<String>> String
		concat(String delimiter, String prefix, String suffix, T values) {
		/**
		 * Collectorsの静的メソッドでCollectorを得てリダクション操作を
		 * 行う方法は，groupingBy等と組み合わせて2段階以上のリダクション操作を
		 * 使う時に有用である。それ以外の時はStream.reduceでリダクション操作を
		 * 行う方法が推奨されている。
		 */
		Collector<CharSequence, ?, String> joiner
			= Collectors.joining(delimiter, prefix, suffix);
		Stream<String> stream = values.stream();

		return stream.collect(joiner);
	}
		
	private static <T, C extends Collection<T>> C copyCollection(C src,
		Supplier<C> supplier){
		C result = supplier.get();
		result.addAll(src);

		return result;
	}
	
	private static <K, V, C extends Map<K, V>> C copyMap(C src, 
		Supplier<C> supplier){
		C result = supplier.get();
		result.putAll(src);

		return result;
	}
		
	public static <T, C extends Collection<T>> C removeIf(C src, 
		Predicate<T> filter, Supplier<C> supplier){
		C result = copyCollection(src, supplier);
		
		result.removeIf(filter);
		
		return result;
	}
	
	public static <T, C extends List<T>> C replaceAll(C src, 
		UnaryOperator<T> op, Supplier<C> supplier){
		C result = copyCollection(src, supplier);
		
		result.replaceAll(op);
		
		return result;
	}
	
	public static <K, V, C extends Map<K, V>> C replaceAll(C src, 
		BiFunction<K, V, V> func, Supplier<C> supplier){
		C result = copyMap(src, supplier);

		result.keySet().stream().forEach((key) -> {
			result.computeIfPresent(key, func);
		});
		
		return result;
	}
	
	public static <T, U> Map<U, Double> averagingBy(Collection<T> src, 
		Function<T, U> classfier, ToDoubleFunction<T> mapper){
		/**
		 * Collectorは合成可能なように設計されている。すなわち副作用のある
		 * Collectorは作らないようにするべきである。
		 */
		Collector<T, ?, Double> averaging = averagingDouble(mapper);
		/**
		 * グループ化はgroupingByConcurrentによって並行化できる。
		 */
		Collector<T, ?, ConcurrentMap<U, Double>> grouping
			= groupingByConcurrent(classfier, averaging);
		
		Map<U, Double> result = src.parallelStream()
			.collect(grouping);
		
		return result;
	}
	
	public static <T, U> Map<Boolean, Map<U, List<T>>> partitioningGroupingBy(
		Collection<T> src, Predicate<T> predicate, Function<T, U> classfier){
		Map<Boolean, Map<U, List<T>>> result = src.parallelStream()
			/**
			 * Collectors.partitioningByが存在する一方で
			 * Collectors.partitioningByConcurrentは存在しない。
			 * 仮にCollectors.partitioningByConcurrentが存在したとしても，
			 * Booleanが持ちうる値の数すなわち2つ(True, False)分までしか
			 * 並行性が上がらないため，Collectors.partitioningByConcurrentは
			 * 不要と見なされたのだろうか？
			 */
			.collect(partitioningBy(predicate, groupingBy(classfier)));
		
		return result;
	}
	
	public static <T> Map<Boolean, List<T>> partitioning(Collection<T> src, 
		Predicate<T> predicate){
		Map<Boolean, List<T>> result = src.parallelStream()
			.collect(partitioningBy(predicate));
		
		return result;
	}
	
	public static Path findPath(Path path, int maxDepth,
		BiPredicate<Path, BasicFileAttributes> matcher) throws IOException {

		Path result;
		/**
		 * Files.findはBasicFileAttributesの値を元に目的のPathを見つけ，
		 * それらのPathを集めて返したい時に有用と思われる。
		 * 単に名前などでPathを探すだけであれば，Files.walkから得られるStreamに対し
		 * filterを適用する方がAPIを利用する側はシンプルに書ける。
		 * 
		 * リソースの破棄をすぐに行いたい場合はtry-with-resources構文を
		 * 使ってStream.closeが呼び出されるようにする。
		 */
		try (Stream<Path> stream = Files.find(path, maxDepth, matcher)) {
			result = stream
				.findFirst()
				.get();
		}

		return result;
	}
	
	public static Path findPath(Path path, int maxDepth, Predicate<Path> matcher) 
		throws IOException{
		Path result;
		
		try (Stream<Path> stream = Files.walk(path, maxDepth)) {
			result = stream
				.filter(matcher)
				.findFirst()
				.get();
		}
		
		return result;
	}
	
	private static class PathAttr {
		private final Path path;
		private final BasicFileAttributes attrs;

		public PathAttr(Path path, BasicFileAttributes attrs) {
			this.path = path;
			this.attrs = attrs;
		}

		public Path getPath() {
			return path;
		}

		public BasicFileAttributes getAttrs() {
			return attrs;
		}
	}
	
	public static Set<Path> findPathSet(Path base, int maxDepth,
		BiPredicate<Path, BasicFileAttributes>... preds) throws IOException {
		BiPredicate<Path, BasicFileAttributes> mather = Stream.of(preds)
			.reduce((pred, nextPred) -> pred.and(nextPred))
			.orElse((path, attr) -> false);

		Set<Path> result;

		boolean byWalk = false;

		/**
		 * ファイルの属性を述語関数(Predicate)の条件に含むのであれば，
		 * Files.walkを使うよりFiles.findを使う方が簡単である。それを以下に示す。
		 */
		if (byWalk) {
			try (Stream<Path> stream = Files.walk(base, maxDepth, FileVisitOption.FOLLOW_LINKS)) {
				/**
				 * Stream.filterはBiPredicateを受け取ることができない。
				 * 受け取れるのはPredicateのみである。
				 * そこでBiPredicateの2つの引数をPathAttrでラップし，
				 * Predicate<PathAttr>型のオブジェクトを用意して
				 * Stream.filterに渡す。
				 */
				Predicate<PathAttr> predicate = 
					pathAttr -> mather.test(pathAttr.getPath(), pathAttr.getAttrs());

				result = stream
					.map(path -> {
						try {
							BasicFileAttributes attrs = 
								Files.readAttributes(path, BasicFileAttributes.class);
							return new PathAttr(path, attrs);
						} catch (IOException ex) {
							throw new IllegalStateException(ex);
						}
					})
					.filter(predicate)
					/**
					 * 本来の戻り値に必要なPath型のオブジェクト群に
					 * マッピングし直す。
					 */
					.map(PathAttr::getPath)
					.collect(toSet());
			}
		} else {
			try (Stream<Path> stream = Files.find(base, maxDepth, mather, FileVisitOption.FOLLOW_LINKS)) {
				result = stream.collect(toSet());
			}
		}

		return result;
	}
	
	/**
	 * remapperの第1引数と第2引数はMap.mergeにおける再マッピングの計算でconsumeされる
	 * 値なのでsuperを使って型を宣言する。一方，remapperの第3引数は再マッピングの結果
	 * produceされる値なのでextendsを使って型を宣言する。
	 * 
	 * 参考：「Effective Java 第2版」 項目28 PECS略語
	 * 
	 */
	public static <K, V, C extends Map<K, V>> C merge(C self, C other, 
		BiFunction<? super V, ? super V, ? extends V> remapper, Supplier<C> supplier){
		C result = copyMap(self, supplier);
		
		other.keySet().stream().forEach((key) -> {
			Optional<V> optVal = Optional.ofNullable(other.get(key));
			/**
			 * Map.mergeはmerge呼び出し元となるMapに副作用がある。
			 * 
			 * Map.mergeは第2引数のvalueがnullだとNullPointerExceptionをスローする。
			 * つまりMap.mergeでnullを値として設定することはできない。
			 * ここではOptional.ifPresentを使い，valueが存在した時だけ
			 * Map.mergeが行われるようにしている。厳密にチェックするならば
			 * keyやremapperについても同様の対応を行わなければならない。
			 */
			optVal.ifPresent(value -> result.merge(key, value, remapper));
		});
		
		return result;
	}
	
	public static <T, C extends Collection<T>> C asList(T[] src, Supplier<C> supplier){
		List<T> eles = Arrays.asList(src);
		C collection = supplier.get();
		collection.addAll(eles);
		
		return collection;
	}
	
	/**
	 * Optionalのような中間のオブジェクトを
	 * 公開APIのシグネチャに含めるのは好ましくない。
	 * 
	 * throws節に型変数を指定することができる。
	 * E extends Throwable の E はRuntimeExceptionである可能性もあるが，
	 * それでもthrows節にEを指定していないとコンパイルエラーになる。
	 */
	public static <T, E extends Throwable> T optionalGet(Optional<T> optional, 
		Supplier<E> exClass) throws E {
		return optional.orElseThrow(exClass);
	}
	
	/**
	 * UnaryOperator<T>はFunction<T, T>とほぼ同じ。
	 * staticメソッドであるidentityメソッドの戻り値の型だけ異なる。
	 */
	public static <T> T vary(T value, UnaryOperator<T> op){
		T result = op.apply(value);
		
		return result;
	}
	
}
