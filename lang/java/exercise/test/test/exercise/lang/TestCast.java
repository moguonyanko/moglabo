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
import exercise.lang.Taxable;

/**
 * 参考:
 * JavaMagazine Vol.34
 */
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

    private interface IParent {}

    private interface IChild extends IParent {}

    private interface IOther {}

    private class CParent {}

    private class CChild extends CParent {}

    private class COther {}
    //private final class COther {}

    private class CastSample1 implements IChild, IOther {}

    // 階層構造を共有しない複数のクラスが継承されることは仕様上あり得ないので
    // detectedCompileErrorOnCastsのexample3はコンパイルエラーになる。
    //private class CastSampleX extends CChild, OChild {}

    private class CastSample2 extends COther implements IChild {}

    @Test
    public void detectedCompileErrorOnCasts() {
        IParent ip = null;
        IChild ic = null;
        IOther io = null;
        CParent cp = null;
        CChild cc = null;
        COther co = null;

        // 階層構造関係なくインターフェース間のキャストはコンパイルエラーにならない。
        ic = (IChild)io; // example1
        // example2は単にスーパークラスをサブクラスの型にキャストしているだけ。
        cc = (CChild)cp; // example2
        // CChildとOChildは何の階層構造も共有しておらず，また今後も共有し得ないため
        // example3のキャストはコンパイルエラーとなる。
        //cc = (CChild)co; // example3
        // 階層構造を共有しないクラスとインターフェース間のキャストは有効である。
        ic = (IChild)co; //example4

        // example1がコンパイルエラーにならないのは以下のようなケースがあり得るためである。
        // インターフェースは階層構造関係なく複数指定して実装することができるので，何の階層構造も
        // 共有しない複数のインターフェース間でのキャストがコンパイルエラーにならない。
        IOther s1 = new CastSample1();
        IChild s2 = (IChild)s1;

        // example4がエラーにならないのは以下のケースがあり得るため。
        // COtherがfinalクラスだった場合，CastSample2のようなクラスを宣言できないので
        // example4のキャストも以下のキャストもコンパイルエラーとなる。
        COther s3 = new CastSample2();
        IChild s4 = (IChild)s3;
    }

}
