package exercise.lang.lambda;

import java.util.Set;
import java.util.function.Consumer;

public class Customer {

	private final Set<ShopItem> items;

	public Customer(Set<ShopItem> items) {
		this.items = items;
	}

	public Set<ShopItem> getItems() {
		return items;
	}
	
	public void consumeAll(Consumer<ShopItem> c){
		items.stream().forEach((item) -> {
			c.accept(item);
			items.remove(item);
		});
	}
	
}
