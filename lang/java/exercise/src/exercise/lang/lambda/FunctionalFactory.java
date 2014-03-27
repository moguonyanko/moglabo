package exercise.lang.lambda;

import java.util.Collection;
import java.util.Map;
import java.util.Set;
import java.util.function.Supplier;

public class FunctionalFactory {

	public static <T, DEST extends Collection<T>> DEST
		packItems(Map<String, Integer> stuffs,
			Supplier<DEST> packFactory) {

		Set<String> keys = stuffs.keySet();

		DEST result = packFactory.get();
		for (String key : keys) {
			ShopItem item = new ShopItem(key, stuffs.get(key));
			//result.add(item); /* @todo compile error... */
		}

		return result;
	}

}
