package exercise.lang.eightmarket;

import java.util.Collection;
import java.util.function.Consumer;
import java.util.function.Supplier;

public class Customer {

	private final Collection<ShopItem> myBag;

	public Customer(Supplier<? extends Collection> bagFactory) {
		this.myBag = bagFactory.get();
	}

	public Customer(Collection<ShopItem> myBag) {
		this.myBag = myBag;
	}

	public Collection<ShopItem> getItems() {
		return myBag;
	}

	public void consumeAll(Consumer<ShopItem> c) {
		myBag.stream().forEach((item) -> {
			c.accept(item);
			myBag.remove(item);
		});
	}

	public double averagePurchaseAmount(ShopItemType type) {
		double avg = myBag.stream()
			.filter(item -> item.getType().equals(type))
			.mapToInt(ShopItem::getPrice)
			.average()
			.getAsDouble();

		return avg;
	}

	public double sumPurchaseAmount(ShopItemType type) {
		
		return 0;

	}

	public void buy(FunctionalShop shop, String itemName) {
		this.myBag.add(shop.getShopItem(itemName));
	}

}
