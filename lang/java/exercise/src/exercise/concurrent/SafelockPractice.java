package exercise.concurrent;

import java.util.Objects;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * 参考：
 * 「Java Tutorial」(オラクル)
 * http://docs.oracle.com/javase/tutorial/essential/concurrency/newlocks.html
 */
public class SafelockPractice {

	public static class Friend implements Comparable<Friend> {

		private final String name;
		private final Lock lock = new ReentrantLock();

		public Friend(String name) {
			this.name = name;
		}

		public boolean impendingBow(Friend bower) {
			boolean myLock = false;
			boolean yourLock = false;

			try {
				myLock = lock.tryLock();
				yourLock = bower.lock.tryLock();
			} finally {
				/**
				 * デッドロックが発生していたような状態，つまりどのスレッドも
				 * ロックを取得できなかった状態では以下の条件分岐の中に入ってこない。
				 * 
				 * デッドロックが発生する状況を検出できるのがLockオブジェクトの
				 * 利点といえる。固有のロック(synchronizedによるロック)ではデッドロックが
				 * 発生する状況をコードで記述するのは難しい。
				 */
				if (!(myLock && yourLock)) {
					if (myLock) {
						lock.unlock();
					}
					if (yourLock) {
						bower.lock.unlock();
					}
				}
			}

			/* どのスレッドもロックを取得できなかった場合はfalseが返される。 */
			return myLock && yourLock;
		}

		public Friend bow(Friend bower) {
			Friend lastBower;

			if (impendingBow(bower)) {
				/**
				 * いずれかのスレッドがロックを取得できた場合
				 */
				try {
					System.out.format("%s: %s が私にお辞儀をした。\n", name, bower.name);
					lastBower = bower.bowBack(this);
				} finally {
					lock.unlock();
					bower.lock.unlock();
				}
			} else {
				/**
				 * どのスレッドもロックを取得できなかった場合
				 */
				System.out.format("%s: %s が私にお辞儀をしようとしたが，"
					+ "既に私が相手にお辞儀をしていた。\n", name, bower.name);
				lastBower = this;
			}

			return lastBower;
		}

		public Friend bowBack(Friend bower) {
			System.out.format("%s: %s が私にお辞儀を返した。\n", name, bower.name);
			return bower;
		}

		@Override
		public boolean equals(Object obj) {
			if (obj instanceof Friend) {
				Friend another = (Friend) obj;
				return name.equals(another.name);
			} else {
				return false;
			}
		}

		@Override
		public int hashCode() {
			return Objects.hash(name);
		}

		@Override
		public String toString() {
			return name;
		}

		@Override
		public int compareTo(Friend friend) {
			return name.compareTo(friend.name);
		}

	}

}
