package test.exercise.lang;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.io.Serializable;
import static java.util.stream.Collectors.*;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

import exercise.function.ShopItem;
import exercise.function.ShopItemType;
import exercise.lang.Favorable;
import exercise.lang.Taxable;

public class TestCast {

	@Test
	public void 複数の型を指定したキャストが行える() {
		ShopItem item = new ShopItem("saury", 1500, ShopItemType.FISH);
		
		/**
		 * TaxableとFavorableに名前が重複したデフォルトメソッドが存在するので
		 * エラーとなる。ShopItemでそのメソッドをオーバーライドしていてもエラーになる。
		 */
		//Taxable t = (Taxable & Favorable)item;
		
		/* ShopItemがCloneableでないのでClassCastExceptionになる。 */
		//Taxable t = (Taxable & Cloneable)item;
		
		/* 以下は無効な文 */
		//if(item instanceof (Taxable & Cloneable)){
		//}
		
		Taxable t = (Taxable & Comparable<ShopItem>)item;
		System.out.println(t);
		
		/* ShopItemに引数無しコンストラクタが無いので以下はエラー。 */
		//ShopItem item2 = new ShopItem(){
		//};
		
		String s = "stanadrd cast";
		CharSequence c = (CharSequence & Comparable<String>) s;
		System.out.println(c);

		/* ラムダ式内の変数のシャドウイングを許されない。 */
		//Function<String, Integer> wordLength = s -> s.length();
		
		/**
		 * Comparator<String> かつ Serializableな型にキャストする。
		 * しかし左辺には1つの型名しか記述できない。
		 */
		Comparator<String> comparator = (Comparator<String> & Serializable) Comparator
			/**
			 * 並べ替えにおいてはまず単語の長さを比較し，長さが同じだった場合は
			 * 文字列の自然順序に従って並べ替えを行う。
			 */
			.comparing(String::length)
			.thenComparing(String::compareTo);
		
		List<String> sources = Arrays.asList(
			"hogehoge", "foo", "bar", "Baz", "mike"
		);
		
		System.out.println(sources);
		
		List<String> expected = Arrays.asList(
			"Baz", "bar", "foo", "mike", "hogehoge"
		);
		
		List<String> actual = sources.stream()
			.sorted(comparator)
			.collect(toList());
		
		assertThat(actual, is(expected));
		
		System.out.println(actual);
	}

}
