package test.exercise.concurrent;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.function.UnaryOperator;
import java.util.stream.IntStream;
import static java.util.stream.Collectors.*;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

public class TestLatch {

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

}
