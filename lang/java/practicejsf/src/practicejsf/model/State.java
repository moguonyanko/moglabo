package practicejsf.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * 州を表すModelにあたるクラス
 * 
 * Viewが求める文字列表現をModelに定義してはいけない。
 * それはControlが提供するべきである。Viewが自身で単純に
 * 必要な文字列表現を用意できるならそれでもいい。但し複雑なELを
 * View即ちFaceletsページに書かなければならなくなるくらいなら
 * Control即ちBeanに文字列表現を任せるべきである。
 * 
 * ModelにViewのための文字列表現を定義するということは
 * ModelにViewの要素を混ぜているに等しい。両者は分離しなければならない。
 * どのように表現するかというのはViewによって変化し得るのだから
 * Modelがその表現方法を意識するような作りになっていてはいけない。
 * Modelが特定のViewに束縛され再利用性や変更可能性を損なうことになる。
 * 
 * 要するにStateInfo.getCityNameMapのようなメソッドをModelにあたるクラスに
 * 定義してはいけないということである。toStringもあくまでも開発者向けの
 * 情報を提供するなど，システムの動作や最終的な表示結果に影響を与えない範囲で
 * 定義され利用されるべきであり，Faceletsページの表示結果に影響を与えるような
 * メソッドにするべきではない。
 */
public class State {

	private final String name;
	private final List<City> cities = new ArrayList<>();

	public State(String name, City... cities) {
		this.name = name;
		this.cities.addAll(Arrays.asList(cities));
	}

	public String getName() {
		return name;
	}

	public List<City> getCities() {
		return new ArrayList<>(cities);
	}

}

