package test.exercise.lang;

import java.util.*;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

import exercise.lang.Func;
import exercise.lang.AccFunc;
import exercise.lang.Discount;
import static exercise.lang.LambdaPractice.*;
import exercise.lang.FunctionalShop;
import exercise.lang.ShopItem;

public class TestLambdaPractice {

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
	}

	@After
	public void tearDown() {
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
			if(acc == null){
				acc = 1;
			}
			return acc * num;
		};

		Integer actual = reduce(nums, multi);
		Integer expected = 1 * 2 * 3;

		assertThat(actual, is(expected));
	}
	
	@Test
	public void predicate_条件を満たす品物を取り出す(){
		FunctionalShop shop = new FunctionalShop(new Discount(1.0));
		
		shop.addShopItem("Apple", 300);
		shop.addShopItem("Orange", 200);
		shop.addShopItem("Meron", 1000);
		shop.addShopItem("Potato", 500);
		shop.addShopItem("Pen", 100);
		
		Set<ShopItem> actual = shop.getShopItems(item -> item.getPrice() > 300);
		Set<ShopItem> expected = new HashSet<>();
		expected.add(new ShopItem("Meron", 1000));
		expected.add(new ShopItem("Potato", 500));
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void function_外部から計算式を与えたときの価格を得る(){
		double rate = 0.5;
		double extraValue = 2.0;
		Discount discount = new Discount(rate);
		FunctionalShop shop = new FunctionalShop(discount);
		
		String targetName = "Meron";
		int targetPrince = 1000;
		shop.addShopItem(targetName, targetPrince);
		
		int actual = shop.getDiscountPrice(targetName, 
			item -> (int)(item.getPrice() * discount.getRate() * extraValue));
		int expected = (int)(targetPrince * rate * extraValue);
		
		assertThat(actual, is(expected));
	}
	
}
