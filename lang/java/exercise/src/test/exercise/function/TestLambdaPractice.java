package test.exercise.function;

import java.util.*;
import java.util.concurrent.CopyOnWriteArraySet;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

import exercise.function.Func;
import exercise.function.AccFunc;
import static exercise.function.LambdaPractice.*;
import exercise.function.Customer;
import exercise.function.Discount;
import exercise.function.FunctionalFactory;
import exercise.function.FunctionalShop;
import exercise.function.ShopItem;
import exercise.function.ShopItemType;

import java.util.function.*;
import java.util.stream.Collectors;

public class TestLambdaPractice {

	/* sample shop */
	private final FunctionalShop shop = new FunctionalShop(new Discount(1.0));
	
	/* sample items */
	private final ShopItem apple = new ShopItem("Apple", 300, ShopItemType.FLUIT);
	private final ShopItem orange = new ShopItem("Orange", 100, ShopItemType.FLUIT);
	private final ShopItem melon = new ShopItem("Melon", 200, ShopItemType.FLUIT);
	private final ShopItem rice = new ShopItem("Rice", 1000, ShopItemType.GRAIN);
	private final ShopItem potato = new ShopItem("Potato", 500, ShopItemType.GRAIN);
	private final ShopItem mealie = new ShopItem("Mealie", 300, ShopItemType.GRAIN);
	private final ShopItem pen = new ShopItem("Pen", 100, ShopItemType.STATIONERY);
	private final ShopItem ruler = new ShopItem("Ruler", 150, ShopItemType.STATIONERY);
	private final ShopItem eraser = new ShopItem("Eraser", 50, ShopItemType.STATIONERY);
	
	private final ShopItem[] shopItems = {
		apple,
		orange,
		melon,
		rice,
		potato,
		mealie,
		pen,
		ruler,
		eraser
	};
	
	public TestLambdaPractice() {
	}

	@BeforeClass
	public static void setUpClass() {
	}

	@AfterClass
	public static void tearDownClass() {
	}

	@Before
	public void setUp() {
		shop.addAllShopItems(shopItems);
	}

	@After
	public void tearDown() {
		shop.clearItems();
	}

	@Test
	public void map_受け取ったリストの各要素に何らかの関数を適用した結果を返す() {
		List<Integer> nums = new ArrayList<>();

		nums.add(1);
		nums.add(2);
		nums.add(3);

		Func<Integer, Integer> square = (num) -> {
			return num * num;
		};

		List<Integer> actual = map(nums, square);

		List<Integer> expected = new ArrayList<>();
		expected.add(1);
		expected.add(4);
		expected.add(9);

		assertThat(actual, is(expected));
	}

	@Test
	public void reduce_受け取ったリストの各要素に関数を適用しその結果をまとめて返す() {
		List<Integer> nums = new ArrayList<>();

		nums.add(1);
		nums.add(2);
		nums.add(3);

		AccFunc<Integer, Integer> multi = (num, acc) -> {
			if (acc == null) {
				acc = 1;
			}
			return acc * num;
		};

		Integer actual = reduce(nums, multi);
		Integer expected = 1 * 2 * 3;

		assertThat(actual, is(expected));
	}

	@Test
	public void predicate_条件を満たす品物を取り出す() {
		FunctionalShop shop = new FunctionalShop(new Discount(1.0));

		ShopItem hMelon = new ShopItem("HighClassMeron", 10000, ShopItemType.FLUIT);
		shop.addShopItem(hMelon);

		List<ShopItem> actual = shop.getShopItems(item -> item.getPrice() > 9000);
		List<ShopItem> expected = new ArrayList<>();
		expected.add(hMelon);

		assertThat(actual, is(expected));
	}

	@Test
	public void function_外部から計算式を与えたときの価格を得る() {
		double rate = 0.5;
		double extraValue = 2.0;
		Discount discount = new Discount(rate);
		FunctionalShop shop = new FunctionalShop(discount);

		shop.addShopItem(melon);

		int actual = shop.getDiscountPrice(melon,
			item -> (int) (item.getPrice() * discount.getRate() * extraValue));
		int expected = melon.getPrice() - (int) (melon.getPrice() * rate * extraValue);

		assertThat(actual, is(expected));
	}

	@Test
	public void consumer_顧客は品物を消費する() {
		Customer customer = new Customer(CopyOnWriteArraySet::new);
		customer.buy(shop, melon);
		customer.buy(shop, potato);
		Consumer<ShopItem> consumer = item -> System.out.println("consume " + item.getName());
		customer.consumeAll(consumer);

		int actual = customer.getBoughtItems().size();
		int expected = 0;
		
		assertThat(actual, is(expected));
	}

	@Test
	public void supplier_工場は製品を作り梱包する() {
		Map<String, Integer> stuffs = new HashMap<>();
		stuffs.put("Lemon", 100);
		stuffs.put("Toy", 1000);
		stuffs.put("Globe", 750);

		Set<ShopItem> actual = FunctionalFactory.packItems(stuffs, HashSet<ShopItem>::new);

		Set<ShopItem> expected = new HashSet<>();
		expected.add(new ShopItem("Lemon", 100));
		expected.add(new ShopItem("Toy", 1000));
		expected.add(new ShopItem("Globe", 750));
		
		assertThat(actual, is(expected));
	}

	@Test
	public void doubleUnaryOperator_店舗の割引率を倍にする() {
		double rate = 0.1;
		Discount discount = new Discount(rate);
		FunctionalShop shop = new FunctionalShop(discount);
		
		shop.addShopItem(melon);
		
		shop.riseDiscount(r -> r * 2);
		
		int actual = shop.getDisCountPrice(melon);
		int expected = 160;
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void doubleBinaryOperator_購買には税金がかかる() {
		double rate = 0.1;
		Discount discount = new Discount(rate);
		FunctionalShop shop = new FunctionalShop(discount);
		
		shop.addShopItem(melon);
		
		double tax = 0.1;
		
		int actual = (int)shop.getDisCountPrice(melon, 
			(p, r) -> p * (1 - r) * (1 + tax));
		int expected = 198;
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void average_特定の品種の平均購入額を求める() {
		Customer customer = new Customer(HashSet::new);
		customer.buy(shop, apple);
		customer.buy(shop, orange);
		customer.buy(shop, pen); /* Not "FLUIT" */
		
		double actual = customer.averagePurchaseAmount(ShopItemType.FLUIT);
		double expected = 200;
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void average_特定の品種の合計購入額を求める() {
		Customer customer = new Customer(HashSet::new);
		customer.buy(shop, apple);
		customer.buy(shop, orange);
		customer.buy(shop, pen); /* Not "FLUIT" */
		
		double actual = customer.sumPurchaseAmount(ShopItemType.FLUIT);
		double expected = 400;
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void collect_購入した品物のうち特定の品種だけを抽出する() {
		Customer customer = new Customer(HashSet::new);
		customer.buy(shop, apple);
		customer.buy(shop, orange);
		customer.buy(shop, pen); /* Not "FLUIT" */
		
		Collection<ShopItem> actual = customer.getBoughtItems(ShopItemType.FLUIT);
		
		Collection<ShopItem> expected = new HashSet<>();
		expected.add(apple);
		expected.add(orange);
		
		assertThat(actual, is(expected));
	}
	
	
	@Test
	public void comparator_購入した品物の一覧を名前順に整列して取得する() {
		shop.clearItems();
		
		shop.addShopItem(orange);
		shop.addShopItem(apple);
		shop.addShopItem(rice);
		shop.addShopItem(ruler);
		shop.addShopItem(potato);
		shop.addShopItem(pen);
		
		Map<ShopItemType, List<ShopItem>> actual = 
			shop.sortedItems();
		
		Map<ShopItemType, List<ShopItem>> expected = new HashMap<>();
		List<ShopItem> fluits = new ArrayList<>();
		fluits.add(apple);
		fluits.add(orange);
		List<ShopItem> grains = new ArrayList<>();
		grains.add(potato);
		grains.add(rice);
		List<ShopItem> stationeries = new ArrayList<>();
		stationeries.add(pen);
		stationeries.add(ruler);
		
		expected.put(ShopItemType.FLUIT, fluits);
		expected.put(ShopItemType.GRAIN, grains);
		expected.put(ShopItemType.STATIONERY, stationeries);
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void groupingBy_品種ごとの平均価格を得る() {
		Map<ShopItemType, Double> actual = shop.avaragePriceByType();
		
		Map<ShopItemType, Double> expected = new HashMap<>();
		expected.put(ShopItemType.FLUIT, 
			(apple.getPrice() + orange.getPrice() + melon.getPrice()) / 3.0);
		expected.put(ShopItemType.GRAIN, 
			(rice.getPrice() + potato.getPrice() + mealie.getPrice()) / 3.0);
		expected.put(ShopItemType.STATIONERY, 
			(pen.getPrice() + ruler.getPrice() + eraser.getPrice()) / 3.0);
		
		assertThat(actual, is(expected));
	}

	@Test
	public void comparator_購入した品物の一覧を逆順に整列して取得する() {
		Map<ShopItemType, List<ShopItem>> actual = 
			shop.reservedItems();
		
		/* アルファベット逆順に品物が返されることを期待する。 */
		Map<ShopItemType, List<ShopItem>> expected = new HashMap<>();
		List<ShopItem> fluits = new ArrayList<>();
		fluits.add(orange);
		fluits.add(melon);
		fluits.add(apple);
		List<ShopItem> grains = new ArrayList<>();
		grains.add(rice);
		grains.add(potato);
		grains.add(mealie);
		List<ShopItem> stationeries = new ArrayList<>();
		stationeries.add(ruler);
		stationeries.add(pen);
		stationeries.add(eraser);
		
		expected.put(ShopItemType.FLUIT, fluits);
		expected.put(ShopItemType.GRAIN, grains);
		expected.put(ShopItemType.STATIONERY, stationeries);
		
		assertThat(actual, is(expected));
	}

	@Test
	public void notnull_割引率にnullは許容されない() {
		Discount discount = new Discount(0.5);
		FunctionalShop _shop = new FunctionalShop(discount);
		Discount actual = _shop.getDiscount();
		Discount notExpected = null;
		assertThat(actual, not(notExpected));
	}

	/**
	 * 参考:
	 * JavaMagazine Vol.38
	 */
	//@FunctionalInterface
	private interface MyInterface {
		void execute();
		default void greet() {
			System.out.println("Hello");
		}
	}

	private static class MyStudent {
		void greet() {
			System.out.println("こんにちは");
		}

		void mainFunc() {
			// このラムダ式はMyInterfaceのexecuteを実装したものになる。
			// FunctionalInterfaceアノテーションをMyInterfaceに指定しても、
			// thisがMyStudentオブジェクトを指すためMyInterfaceのgreetが
			// 呼び出されることはない。
			MyInterface f1 = () -> this.greet();
			f1.execute();
			// クラス名経由でthisを参照しても結果は同じ。
			MyInterface f2 = () -> MyStudent.this.greet();
			f2.execute();
		}
	}

	@Test
	public void checkNotCreateScopeByLambda() {
		var myStudent = new MyStudent();
		myStudent.mainFunc();
	}

	@Test
	public void checkSyntaxStaticMethodReference() {
		IntFunction<String> f1 = i -> String.valueOf(i);
		IntFunction<String> f2 = String::valueOf;

		assertThat(f1.apply(1), is(f2.apply(1)));
	}

	private static class SampleA {
		private final String[] values;

		private SampleA(String[] values) {
			this.values = values;
		}

		@Override
		public boolean equals(Object obj) {
			if (obj instanceof SampleA) {
				var that = (SampleA)obj;
				return Arrays.equals(values, that.values);
			}
			return false;
		}

        @Override
        public int hashCode() {
            // 可変長引数を受け取るメソッドの引数に配列を渡しているので
            // キャストしていないと可変引数呼び出しなのか非可変引数呼び出しなのか
            // 決定することができず警告が表示される。
            // ここではString[]型のフィールド1つを使ってハッシュ値を計算したい、
            // 即ち非可変引数呼び出しでよいのでObject[]にキャストする。
            return Objects.hash((Object[])values);
        }
	}

	@Test
	public void checkSyntaxConstructorReference() {
		Function<String[], SampleA> f1 = s -> new SampleA(s);
		Function<String[], SampleA> f2 = SampleA::new;

		var s = new String[]{"A", "B", "C"};
		assertThat(f1.apply(s), is(f2.apply(s)));
	}

	private static class SampleB {

		private final String name;

		private SampleB(String name) {
			this.name = name;
		}

		private <T extends CharSequence> String getSampleName(T o) {
			return "Sample Instance Method by " + name +
				" and " + o.toString();
		}

		private static String getSampleName(String v) {
			return "Sample Static Method";
		}

		private String getMembers(String ...m1) {
			return name + "," +
				Arrays.stream(m1).collect(Collectors.joining(","));
		}
	}

	private static class MyList<T> {
		private final List<T> list = new ArrayList<>();

		private MyList(List<T> list) {
			this.list.addAll(list);
		}

		private MyList<T> concat(MyList<T> that) {
			var l = new ArrayList<>(list);
			l.addAll(that.list);
			return new MyList<>(l);
		}

		@Override
		public boolean equals(Object obj) {
			if (obj instanceof MyList) {
				var that = (MyList)obj;
				return list.equals(that.list);
			}
			return false;
		}

		@Override
		public int hashCode() {
			return Objects.hash(list);
		}
	}

	@Test
	public void checkSyntaxInstanceMethodReference() {
		var v = "Peter";
		var m1 = "Foo";
		var m2 = "Bar";
		var sb = new SampleB(v);

		// sb::getSampleNameと記述してもより型が適合する方を参照する。
		// すなわちここではstaticメソッドを参照しコンパイルエラーとなる。
		//UnaryOperator<String> f1a = s -> sb.getSampleName(s);
		//UnaryOperator<String> f1b = sb::getSampleName;
		//UnaryOperator<String> f2a = s -> SampleB.getSampleName(s);
		// SampleB::getSampleNameではインスタンスメソッドとstaticメソッドの
		// どちらを参照するのかが決定できずコンパイルエラーとなる。
		//UnaryOperator<String> f2b = SampleB::getSampleName;

		BiFunction<MyList, MyList, MyList> bf1 =
			(l1, l2) -> l1.concat(l2);
		BiFunction<MyList, MyList, MyList> bf2 =
			MyList::concat;
		var ml1 = new MyList<>(List.of("Hoge", "Foo"));
		var ml2 = new MyList<>(List.of("Hoge", "Foo"));
		assertEquals(bf1.apply(ml1, ml2), bf2.apply(ml1, ml2));

		BiFunction<String, String, String> f3a = (a, b) ->
			sb.getMembers(a, b);
		BiFunction<String, String, String> f3b = sb::getMembers;
		assertEquals(f3a.apply(m1, m2), f3b.apply(m1, m2));
	}

}
