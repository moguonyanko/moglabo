package exercise.lang.eight;

import java.util.Collection;
import java.util.Map;
import java.util.Set;
import java.util.function.Supplier;

public class FunctionalFactory {

	public static <DEST extends Collection> DEST
		packItems(Map<String, Integer> stuffs,
			Supplier<DEST> packFactory) {

		Set<String> keys = stuffs.keySet();

		DEST result = packFactory.get();
		
		keys.stream().map((key) -> 
		new ShopItem(key, stuffs.get(key))).forEach((item) -> {
			result.add(item);
		});

		return result;
	}

}
