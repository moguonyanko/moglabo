package practicejsf.bean;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.faces.bean.ManagedBean;

@ManagedBean
public class FruitShop {
	
	private final String shopName;
	private final List<Person> employees;

	public FruitShop() {
		this.shopName = "サンプル果物屋";
		this.employees = Arrays.asList(
			new AlwaysSuccessPerson("Foo", "Far", ""),
			new AlwaysSuccessPerson("Hoge", "Hone", "hogehone@myhome.net"),
			/**
			 * nullもELでは空として扱われる。
			 */
			new AlwaysSuccessPerson("Usao", "Hapoo", null)
		);
	}
	
	public enum Fruit {
		APPLE("りんご", Arrays.asList("A県", "B県", "C県")),
		ORANGE("みかん", Arrays.asList("D県", "E県")),
		BANANA("バナナ", Arrays.asList("F府", "G県", "H県", "I県"));

		private final String displayName;
		private final List<String> producingRegions;

		private Fruit(String displayName, List<String> producingRegions) {
			this.displayName = displayName;
			this.producingRegions = producingRegions;
		}

		public String getDisplayName() {
			return displayName;
		}

		public List<String> getProducingRegions() {
			return new ArrayList<>(producingRegions);
		}
	}

	public List<String> getFruitNames() {
		return Stream.of(Fruit.values())
			.map(Fruit::getDisplayName)
			.collect(Collectors.toList());
	}
	
	public List<Fruit> getFruits() {
		return Stream.of(Fruit.values()).collect(Collectors.toList());
	}

	public String getShopName() {
		return shopName;
	}

	public List<Person> getEmployees() {
		return new ArrayList<>(employees);
	}
	
}
