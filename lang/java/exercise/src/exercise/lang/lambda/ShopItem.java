package exercise.lang.lambda;

import java.util.Objects;

public class ShopItem implements Taxable, Favorable {

	private final String name;
	private final int price;

	public ShopItem(String name, int price) {
		this.name = name;
		this.price = price;
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

}
