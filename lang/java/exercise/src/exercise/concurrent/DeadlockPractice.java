package exercise.concurrent;

import java.util.Objects;

/**
 * 参考：
 * 「Java Tutorial」(オラクル)
 * http://docs.oracle.com/javase/tutorial/essential/concurrency/deadlock.html
 */
public class DeadlockPractice {

	public static class Friend implements Comparable<Friend> {

		private final String name;

		public Friend(String name) {
			this.name = name;
		}

		public synchronized Friend bow(Friend bower) {
			System.out.format("%s: %s が私にお辞儀をした。\n", name, bower.name);
			return bower.bowBack(this);
		}

		public synchronized Friend bowBack(Friend bower) {
			System.out.format("%s: %s が私にお辞儀を返した。\n", name, bower.name);
			return bower;
		}

		@Override
		public boolean equals(Object obj) {
			if(obj instanceof Friend){
				Friend another = (Friend)obj;
				return name.equals(another.name);
			}else{
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
		public int compareTo(Friend another) {
			return name.compareTo(another.name);
		}
		
	}
	
	public static class NullFriend extends Friend {
		
		private static final String NAME = "NO NAME";

		public NullFriend() {
			super(NAME);
		}
		
	}

}
