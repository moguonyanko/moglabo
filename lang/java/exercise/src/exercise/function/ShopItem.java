package exercise.function;

import java.util.Objects;

import exercise.lang.Taxable;
import exercise.lang.Favorable;

public class ShopItem implements Taxable, Favorable, Comparable<ShopItem> {

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

		return this.getType().equals(other.getType()) && 
			name.equals(other.name) && 
			price == other.price;
	}

	@Override
	public int hashCode() {
		int hash = 7;
		hash = 37 * hash + Objects.hashCode(this.name);
		hash = 37 * hash + this.price;
		return hash;
	}

	/**
	 * 
	 */
	@Override
	public int getAmount() {
		/**
		 * インターフェースのデフォルトメソッドが衝突した時は
		 * デフォルトメソッドをオーバーライドしなければコンパイルエラーになる。
		 * 実装したクラス側でどちらのデフォルトメソッドを使うかは
		 * superを経由して指定することができる。
		 */
		return Favorable.super.getAmount();
		//return getPrice();
	}

	public ShopItemType getType() {
		return type;
	}

	@Override
	public int compareTo(ShopItem o) {
		return this.getName().compareTo(o.getName());
	}

}
