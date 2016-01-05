package test.exercise.concurrent;

import java.util.concurrent.Callable;
import static java.util.stream.Collectors.*;

import org.junit.Test;
import static exercise.concurrent.DeadlockPractice.*;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

/**
 * 参考：
 * 「Java Tutorial」(オラクル)
 */
public class TestDeadlockPractice {

	/**
	 * 参考：
	 * http://docs.oracle.com/javase/tutorial/essential/concurrency/deadlock.html
	 */
	@Test
	public void デッドロックが発生して結果を得られないことがある() throws InterruptedException {
		Friend foo = new Friend("foo");
		Friend bar = new Friend("bar");
		Set<Friend> expected = new HashSet<>();
		expected.add(foo);
		expected.add(bar);

		Callable<Friend> c1 = () -> foo.bow(bar);
		Callable<Friend> c2 = () -> bar.bow(foo);
		List<Callable<Friend>> cs = Arrays.asList(c1, c2);

		ExecutorService pool = Executors.newFixedThreadPool(4);

		/**
		 * Callable.callをそのまま呼び出しても並列処理にならない。
		 */
		//Friend f1 = c1.call();
		//Friend f2 = c2.call();
		/**
		 * ExecutorServiceを介して並行処理を行ってもデッドロックの問題が
		 * 解消されるわけではない。
		 */
		List<Future<Friend>> results = pool.invokeAll(cs, 1000L, TimeUnit.MILLISECONDS);
		Friend nullFriand = new NullFriend();

		Set<Friend> actual = results.stream()
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
					System.err.println(ex.getMessage());
				}
				return nullFriand;
			})
			.collect(toSet());

		if (actual.contains(nullFriand)) {
			System.out.println("デッドロックが発生したため並列処理はタイムアウトされました。");
			System.out.println(actual);
		} else {
			assertThat(actual, is(expected));
		}
	}

}
