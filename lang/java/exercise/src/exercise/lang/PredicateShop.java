package exercise.lang;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

public class PredicateShop {

	private final List<ShopItem> items = new ArrayList<>();
	
	public List<ShopItem> getShopItem(Predicate<ShopItem> pred){
		List<ShopItem> result = new ArrayList<>();
		
		items.stream().filter((item) -> (pred.test(item))).forEach((item) -> {
			result.add(item);
		});
		
		return result;
	}
	
	public void addShopItem(ShopItem item){
		items.add(item);
	}
	
}
