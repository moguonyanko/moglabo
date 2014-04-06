package exercise.lang.eightmarket;

import java.util.Objects;

public class ShopItem implements Taxable, Favorable {

	private final String name;
	private final int price;
	private final ShopItemType type;

	public ShopItem(String name, int price, ShopItemType type) {
		this.name = name;
		this.price = price;
		this.type = type;
	}
	
	public ShopItem(String name, int price) {
		this(name, price, ShopItemType.ANY);
	}

	public final String getName() {
		return name;
	}

	public final int getPrice() {
		return price;
	}

	@Override
	public String toString() {
		return name + ":" + price;
	}

	@Override
	public boolean equals(Object obj) {
		if (obj == null) {
			return false;
		}

		if (!(obj instanceof ShopItem)) {
			return false;
		}

		ShopItem other = (ShopItem) obj;

		return name.equals(other.name) && price == other.price;
	}

	@Override
	public int hashCode() {
		int hash = 7;
		hash = 37 * hash + Objects.hashCode(this.name);
		hash = 37 * hash + this.price;
		return hash;
	}

	@Override
	public int getAmount() {
		return getPrice();
	}

	public ShopItemType getType() {
		return type;
	}

}
