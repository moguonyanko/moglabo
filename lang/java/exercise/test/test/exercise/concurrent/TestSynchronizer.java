package test.exercise.concurrent;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.*;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.function.UnaryOperator;
import java.util.stream.IntStream;
import java.util.Set;
import java.util.stream.Stream;

import static java.util.stream.Collectors.*;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

import exercise.concurrent.Concurrents;

public class TestSynchronizer {

	@BeforeClass
	public static void setUpClass() {
	}

	@AfterClass
	public static void tearDownClass() {
	}

	@Before
	public void setUp() {
	}

	@After
	public void tearDown() {
	}

	private static class CountDownOperator<T> implements Callable<T> {

		private final CountDownLatch latch;
		private final T value;
		private final UnaryOperator<T> operator;

		public CountDownOperator(CountDownLatch latch, T value, 
			UnaryOperator<T> operator) {
			this.latch = latch;
			this.value = value;
			this.operator = operator;
		}

		@Override
		public T call() {
			try {
				T result = operator.apply(value);
				latch.countDown();
				return result;
			} catch (Exception ex) {
				throw new IllegalThreadStateException(ex.getMessage());
			}
		}

	}

	@Test
	public void スレッドを任意の回数だけ待機させながら計算を行う() throws InterruptedException {
		/**
		 * 実行されるタスクの数と同じにする。
		 * この数がゼロになるまでカウントダウンされたということは
		 * 全てのタスクが完了したということである。
		 */
		int taskSize = 1000;
		double defaultValue = 0;
		
		CountDownLatch latch = new CountDownLatch(taskSize);
		UnaryOperator<Double> sqrtFunc = x -> Math.sqrt(x);
		
		List<CountDownOperator<Double>> tasks = IntStream.rangeClosed(1, taskSize)
			.mapToObj(value -> new CountDownOperator<Double>(latch, (double)value, sqrtFunc))
			.collect(toList());
		
		ExecutorService pool = Executors.newCachedThreadPool();
		List<Future<Double>> futures = pool.invokeAll(tasks);
		List<Double> results = Concurrents.getResultList(futures, defaultValue);
		/**
		 * タスクを個々に実行しても正しい結果が得られる。
		 */
		//List<Double> results = new ArrayList<>();
		//for(CountDownOperator<Double> task : tasks){
		//	Future<Double> result = pool.submit(task);
		//	try {
		//		results.add(result.get());
		//	} catch (ExecutionException ex) {
		//		results.add(defaultValue);
		//	}
		//}
		
		/**
		 * taskSize回カウントダウンされるまで，つまり
		 * 全てのタスクが完了するまで待機する。
		 * しかしawaitしなくても正しい結果が得られてしまう。
		 * タスクの処理内容が軽すぎるのかもしれない。
		 */
		latch.await();
		
		int expected = 21097;
		
		double result = results.stream()
			.reduce(defaultValue, Double::sum);
		int actual = (int)result;
		
		pool.shutdown();
		
		assertThat(actual, is(expected));
	}
	
	private static class EchoService<T>{
		
		private int echoLimit;

		public EchoService(int echoLimit) {
			this.echoLimit = echoLimit;
		}
		
		private T echo(T value){
			echoLimit--;
			return value;
		}
		
		private boolean done(){
			return echoLimit <= 0;
		}
		
	}
	
	/**
	 * 参考；
	 * http://docs.oracle.com/javase/jp/8/docs/api/java/util/concurrent/CyclicBarrier.html#CyclicBarrier-int-java.lang.Runnable-
	 * 「Java並行処理プログラミング」
	 */
	private static class EchoIntGetter implements Callable<Integer> {

		private final int value;
		
		private final EchoService<Integer> service;
		private final CyclicBarrier barrier;
		
		private static final int TIMEOUT_SECONDS = 3;

		public EchoIntGetter(int value, EchoService<Integer> service, CyclicBarrier barrier) {
			this.value = value;
			this.service = service;
			this.barrier = barrier;
		}

		@Override
		public Integer call() throws TimeoutException {
			while (!service.done()) {
				int val = service.echo(value);

				/**
				 * ここでCyclicBarrier.awaitすると処理が返ってこない。
				 */
				//try {
					System.out.println("現在待機中パーティ:" + barrier.getNumberWaiting());
					//barrier.await(TIMEOUT_SECONDS, TimeUnit.SECONDS);
				//} catch (InterruptedException | BrokenBarrierException ex) {
				//	String msg = "値の取得に失敗しました。:" + ex.getMessage();
				//	throw new IllegalStateException(msg);
				//}

				return val;
			}

			return 0;
		}
	}

	@Test
	public void 最終結果を得られる状態になるまでバリアを使って待つ() throws InterruptedException {
		int size = 10;
		
		/**
		 * CyclicBarrier.awaitが実行されなければバリアー・アクションは実行されない。
		 */
		Runnable callback = () -> System.out.print("バリアー・アクション実行！");
		CyclicBarrier barrier = new CyclicBarrier(size, callback);
		EchoService<Integer> service = new EchoService<>(size);
		
		int processors = Runtime.getRuntime().availableProcessors();
		ExecutorService pool = Executors.newFixedThreadPool(processors);
		
		List<EchoIntGetter> workers = IntStream.rangeClosed(1, size)
			.mapToObj(i -> new EchoIntGetter(i, service, barrier))
			.collect(toList());
		
		/**
		 * ExecutorServiceとCyclicBarrierは同時に使うべきものではないのではないか。
		 * ExecutorServiceには結果をまとめて得る機能もタイムアウト機能も備わっている。
		 */
		List<Future<Integer>> futures = pool.invokeAll(workers);
		int defaultValue = 0;
		Set<Integer> results = Concurrents.getResultSet(futures, defaultValue);
		
		System.out.println("バリアが壊れているか:" + barrier.isBroken());
		
		int expected = IntStream.rangeClosed(1, size).sum();
		int actual = results.stream().mapToInt(i -> i).sum();
		
		pool.shutdown();
		
		assertThat(actual, is(expected));
	}

	/**
	 * 参考:
	 * JavaMagazine Vol.45
	 */

//	private static final List<Integer> results =
//		Collections.synchronizedList(new ArrayList<>());
	private static final List<Integer> results = new ArrayList<>();

	private static class Cup implements Runnable {
		private final CyclicBarrier barrier;
		private final int ball;

		private Cup(CyclicBarrier barrier, int ball) {
			this.barrier = barrier;
			this.ball = ball;
		}

		@Override
		public void run() {
			results.add(ball * ball);
			try {
				barrier.await();
			} catch (InterruptedException | BrokenBarrierException e) {
				e.printStackTrace();
			}
		}
	}

	@Test
	public void awaitThreadsByCyclicBarrier() throws ExecutionException,
		InterruptedException {
		var parties = 2;
		var v1 = 5;
		var v2 = 11;
		Function<List<Integer>, Integer> func =
			balls -> balls.stream().mapToInt(Integer::intValue).sum();
		Runnable action = () -> {
			var actual = func.apply(results);
			var expected = 146;
			assertThat(actual, is(expected));
			System.out.println("Sum: " + actual);
		};
		// barrierがawaitされないとactionは実行されない。
		var barrier = new CyclicBarrier(parties, action);
		var c1 = new Cup(barrier, v1);
		var c2 = new Cup(barrier, v2);
		var service = Executors.newFixedThreadPool(parties);

		System.out.println(func.apply(results));

		// 以下のコードでは稀に正しくない計算結果がaction内で観測されてエラーを引き起こす。
//		var fa = service.submit(c1);
//		var fb = service.submit(c2);
//		fa.get();
//		fb.get();

		var f1 = CompletableFuture.runAsync(c1, service);
		var f2 = CompletableFuture.runAsync(c2, service);
		var cf = CompletableFuture.allOf(f1, f2).thenAcceptAsync(v -> {
			// 最後に処理されることが保証される。
			System.out.println("All tasks finished");
		});
		// getを呼び出さないとCyclicBarrierのactionが実行されないことがある。
		// (メインスレッドが先に完了してしまう)
		cf.get();
	}

}
