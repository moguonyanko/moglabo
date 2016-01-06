package test.exercise.concurrent;

import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import static java.util.stream.Collectors.*;

import org.junit.Test;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

import exercise.concurrent.DeadlockPractice;
import exercise.concurrent.SafelockPractice;

/**
 * 参考：
 * 「Java Tutorial」(オラクル)
 */
public class TestLockPractice {

	private <T> Set<T> getResultSet(Collection<Future<T>> src, T defaultValue) {
		Set<T> actual = src.stream()
			/**
			 * メソッド参照を使うとFuture.getでスローされる例外が
			 * Function.applyの定義に適合しないためコンパイルエラーになる。
			 *
			 * ExceptionまたはThrowableが型パラメータを受け取れるようになっていれば
			 * Function.applyがチェック例外をスローできるように定義できたのでは
			 * ないだろうか。
			 */
			//.map(Future::get)
			.map(future -> {
				try {
					/**
					 * タイムアウトされたタスクはキャンセルされる。
					 */
					if (!future.isCancelled()) {
						return future.get();
					}
				} catch (InterruptedException | ExecutionException ex) {
					throw new IllegalStateException(ex.getMessage());
				}
				return defaultValue;
			})
			.collect(toSet());

		return actual;
	}
	
	/**
	 * 参考：
	 * http://docs.oracle.com/javase/tutorial/essential/concurrency/deadlock.html
	 */
	@Test
	public void デッドロックが発生して結果を得られないことがある() throws InterruptedException {
		DeadlockPractice.Friend foo = new DeadlockPractice.Friend("foo");
		DeadlockPractice.Friend bar = new DeadlockPractice.Friend("bar");
		Set<DeadlockPractice.Friend> expected = new HashSet<>();
		expected.add(foo);
		expected.add(bar);

		Callable<DeadlockPractice.Friend> c1 = () -> foo.bow(bar);
		Callable<DeadlockPractice.Friend> c2 = () -> bar.bow(foo);
		List<Callable<DeadlockPractice.Friend>> cs = Arrays.asList(c1, c2);

		/**
		 * ExecutorServiceを介して並行処理を行ってもデッドロックの問題が
		 * 解消されるわけではない。
		 */
		ExecutorService pool = Executors.newFixedThreadPool(4);

		/**
		 * Callable.callをそのまま呼び出しても並列処理にならない。
		 */
		//Friend f1 = c1.call();
		//Friend f2 = c2.call();
		/**
		 * デッドロック発生時に処理が戻らなくなる状況から回復できるように
		 * タイムアウト時間を指定している。
		 */
		List<Future<DeadlockPractice.Friend>> results = pool.invokeAll(cs, 1000L, TimeUnit.MILLISECONDS);
		DeadlockPractice.Friend nullFriand = new DeadlockPractice.NullFriend();
		Set<DeadlockPractice.Friend> actual = getResultSet(results, nullFriand);

		if (actual.contains(nullFriand)) {
			System.out.println("デッドロックが発生したため並列処理はタイムアウトされました。");
			System.out.println(actual);
		} else {
			assertThat(actual, is(expected));
		}
	}

	/**
	 * 参考：
	 * http://docs.oracle.com/javase/tutorial/essential/concurrency/newlocks.html
	 */
	@Test
	public void Lockオブジェクトにより安全なロックを行う() throws InterruptedException{
		SafelockPractice.Friend foo = new SafelockPractice.Friend("safe foo");
		SafelockPractice.Friend bar = new SafelockPractice.Friend("safe bar");
		Set<SafelockPractice.Friend> expected = new HashSet<>();
		expected.add(foo);
		expected.add(bar);

		Callable<SafelockPractice.Friend> c1 = () -> foo.bow(bar);
		Callable<SafelockPractice.Friend> c2 = () -> bar.bow(foo);
		List<Callable<SafelockPractice.Friend>> cs = Arrays.asList(c1, c2);

		ExecutorService pool = Executors.newFixedThreadPool(4);

		/**
		 * 安全なロックが行われているならデッドロックのような無限に待ち続ける状況は
		 * 発生せず，しかるにExecutorService.invokeAllにタイムアウト時間の指定は
		 * 不要なはずである。ロック以外の原因でスレッドの処理時間が長くなる可能性は
		 * あるのだから実運用時は指定するべきである。
		 */
		List<Future<SafelockPractice.Friend>> futures = pool.invokeAll(cs);
		SafelockPractice.Friend defaultVallue = new SafelockPractice.Friend("SAFE NO NAME");
		Set<SafelockPractice.Friend> actual = getResultSet(futures, defaultVallue);
		
		assertThat(actual, is(expected));
	}
	
}
