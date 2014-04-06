package exercise.lang.eight;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.function.DoubleBinaryOperator;
import java.util.function.DoubleUnaryOperator;
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
	
	public void addShopItem(String name, int price, ShopItemType type){
		items.put(name, new ShopItem(name, price, type));
	}
	
	public void addShopItem(String name, int price){
		this.addShopItem(name, price, ShopItemType.ANY);
	}
	
	public final int getDiscountPrice(String name, Function<ShopItem, Integer> f){
		int orgPrice = items.get(name).getPrice();
		return orgPrice - f.apply(items.get(name));
	}
	
	public final int getDisCountPrice(String name){
		int orgPrice = items.get(name).getPrice();
		return orgPrice - (int)(orgPrice * discount.getRate());
	}

	public final double getDisCountPrice(String name, DoubleBinaryOperator op){
		int orgPrice = items.get(name).getPrice();
		return op.applyAsDouble(orgPrice, discount.getRate());
	}
	
	public void riseDiscount(DoubleUnaryOperator operator){
		double newRate = operator.applyAsDouble(discount.getRate());
		discount = new Discount(newRate);
	}
	
	public final ShopItem getShopItem(String name){
		return items.get(name);
	}
	
}
