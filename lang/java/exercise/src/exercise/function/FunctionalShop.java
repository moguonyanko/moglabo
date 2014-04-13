package exercise.function;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentMap;
import java.util.function.DoubleBinaryOperator;
import java.util.function.DoubleUnaryOperator;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import javax.validation.constraints.NotNull;

public class FunctionalShop {

	private final Map<ShopItemType, List<ShopItem>> allItems = new HashMap<>();
	private final Map<ShopItem, Integer> priceTable = new HashMap<>();

	private Discount discount = new Discount(1.0);

	public FunctionalShop(@NotNull Discount discount) {
		this.discount = discount;
	}

	public List<ShopItem> getShopItems(Predicate<ShopItem> pred) {
		List<ShopItem> result = new ArrayList<>();
		Set<ShopItemType> types = allItems.keySet();

		for (ShopItemType type : types) {
			List<ShopItem> items = allItems.get(type);
			for (ShopItem item : items) {
				if (pred.test(item)) {
					result.add(item);
				}
			}
		}

		return result;
	}

	public void addShopItem(ShopItem item) {
		if (!allItems.containsKey(item.getType())) {
			allItems.put(item.getType(), new ArrayList<>());
		}

		allItems.get(item.getType()).add(item);
		priceTable.put(item, item.getPrice());
	}

	public void addShopItem(String name, int price, ShopItemType type) {
		addShopItem(new ShopItem(name, price, type));
	}

	public void addAllShopItems(ShopItem[] items) {
		for(ShopItem item : items){
			addShopItem(item);
		}
	}
	
	public void clearItems() {
		allItems.clear();
	}

	public final int getDiscountPrice(ShopItem item, Function<ShopItem, Integer> f) {
		int orgPrice = priceTable.get(item);
		return orgPrice - f.apply(item);
	}

	public final int getDisCountPrice(ShopItem item) {
		int orgPrice = priceTable.get(item);
		return orgPrice - (int) (orgPrice * discount.getRate());
	}

	public final double getDisCountPrice(ShopItem item, DoubleBinaryOperator op) {
		int orgPrice = priceTable.get(item);
		return op.applyAsDouble(orgPrice, discount.getRate());
	}

	public void riseDiscount(DoubleUnaryOperator operator) {
		double newRate = operator.applyAsDouble(discount.getRate());
		discount = new Discount(newRate);
	}

	public ShopItem orderItem(ShopItem orderedItem) {
		List<ShopItem> items = allItems.get(orderedItem.getType());
		for (ShopItem item : items) {
			if (item.equals(orderedItem)) {
				return item;
			}
		}

		return null;
	}

	public Map<ShopItemType, List<ShopItem>> sortedItems(final Comparator<ShopItem> c) {
		Map<ShopItemType, List<ShopItem>> itemView = Collections.synchronizedMap(allItems);

		/* Don't use parallelStream */
		itemView.keySet().stream().map((type) -> 
			itemView.get(type)).forEach((items) -> {
				items.sort(c);
			});

		return itemView;
	}

	public Map<ShopItemType, List<ShopItem>> sortedItems() {
		return this.sortedItems(ShopItem::compareTo);
	}
	
	public Map<ShopItemType, List<ShopItem>> reservedItems() {
		Comparator<ShopItem> c = ShopItem::compareTo;
		Comparator<ShopItem> r = c.reversed();
		
		return this.sortedItems(r);
	}

	public Map<ShopItemType, Double> avaragePriceByType(){
		/* groupingBy method test */
		List<ShopItem> roster = new ArrayList<>();
		allItems.keySet().parallelStream().forEach((type) -> {
			List<ShopItem> items = allItems.get(type);
			roster.addAll(items);
		});
		
		ConcurrentMap<ShopItemType, Double> result = roster.parallelStream().collect(
			Collectors.groupingByConcurrent(ShopItem::getType, 
				Collectors.averagingInt(ShopItem::getPrice))
		);
		
		/* normal operation */
//		ConcurrentMap<ShopItemType, Double> result = new ConcurrentHashMap<>();
//		allItems.keySet().parallelStream().forEach((type) -> {
//			List<ShopItem> items = allItems.get(type);
//			int sumValue = items.stream().mapToInt(ShopItem::getPrice).sum();
//			double avgValue = sumValue / items.size();
//			result.put(type, avgValue);
//		});
		
		return result;
	}

	public Discount getDiscount() {
		return discount;
	}
	
}
