package exercise.function;

import java.util.Collection;
import java.util.function.Consumer;
import java.util.function.Supplier;
import java.util.stream.Collectors;

public class Customer<T extends Collection<ShopItem>> {

	private final T myBag;
	private final Supplier<T> bagFactory;

	public Customer(Supplier<T> bagFactory) {
		this.myBag = bagFactory.get();
		this.bagFactory = bagFactory;
	}

	public T getBoughtItems() {
		return myBag;
	}

	public void consumeAll(Consumer<ShopItem> c) {
		myBag.stream().forEach((item) -> {
			c.accept(item);
			myBag.remove(item);
		});
	}

	public double averagePurchaseAmount(ShopItemType type) {
		double avgValue = myBag.stream()
			.filter(item -> item.getType().equals(type))
			.mapToInt(ShopItem::getPrice)
			.average()
			.getAsDouble();

		return avgValue;
	}

	public double sumPurchaseAmount(ShopItemType type) {
		double sumValue = myBag.stream()
			.filter(item -> item.getType().equals(type))
			.mapToInt(ShopItem::getPrice)
			//.reduce(0, (a, b) -> a + b);
			.sum();

		return sumValue;
	}

	public void buy(FunctionalShop shop, ShopItem item) {
		ShopItem savedItem = shop.orderItem(item);
		
		if(savedItem != null){
			this.myBag.add(savedItem);
		}
	}
	
	public T getBoughtItems(ShopItemType type){
		T items = myBag.stream()
			.filter(item -> item.getType().equals(type))
			.collect(Collectors.toCollection(bagFactory));

		return items;
	}

}
