package exercise.function.util;

import java.util.Collection;
import java.util.function.Consumer;

public class Functions {

	public static <T> void dump(Collection<T> targets, Consumer<? super T> dumpAction) {
		targets.forEach(target -> dumpAction.accept(target));
	}
}
