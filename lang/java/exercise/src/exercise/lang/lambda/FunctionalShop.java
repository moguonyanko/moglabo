package exercise.lang.lambda;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.function.Predicate;

public class FunctionalShop {

	private final Map<String, ShopItem> items = new HashMap<>();
	
	private Discount discount = new Discount(1.0);

	public FunctionalShop(Discount discount) {
		this.discount = discount;
	}
	
	public Set<ShopItem> getShopItems(Predicate<ShopItem> pred){
		Set<ShopItem> result = new HashSet<>();
		Set<String> names = items.keySet();
		
		/* low readability... */
		names.stream().map((name) -> 
			items.get(name)).filter((item) -> 
			(pred.test(item))).forEach((item) -> {
			result.add(item);
		});
	
		return result;
	}
	
	public void addShopItem(String name, int price){
		items.put(name, new ShopItem(name, price));
	}
	
	public int getDiscountPrice(String name, Function<ShopItem, Integer> f){
		return f.apply(items.get(name));
	}
	
	public int getDisCountPrice(String name){
		return (int)(items.get(name).getPrice() * discount.getRate());
	}
	
}
