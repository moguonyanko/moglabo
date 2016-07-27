package practicejsf.bean.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import practicejsf.model.City;
import practicejsf.model.State;

public class StateInfo {

	private final List<State> states = new ArrayList<>();

	public StateInfo() {
		State state1 = new State("Maryland",
			new City("Baltimore", "622,104"),
			new City("Columbia", "105,000"),
			new City("Frederick", "66,893"),
			new City("Gaithersburg", "65,690")
		);

		State state2 = new State("Virginia",
			new City("Virginia Beach", "448,479"),
			new City("Norfolk", "246,139"),
			new City("Chesapeake", "230,571"),
			new City("Arlington", "224,906")
		);

		states.add(state1);
		states.add(state2);
	}

	public List<String> getStateNames() {
		return states.stream()
			.map(State::getName)
			.collect(Collectors.toList());
	}

	/**
	 * FaceletsページでConverterを指定する手間が増えるので，
	 * 複数作成し切り替えて使用したり，何度か再利用したりするのでなければ
	 * Converterは作成しないようにしたい。Converterはオブジェクトと文字列の
	 * 相互変換が行えるものの1種類の変換しか提供しないので，むやみに作成すると
	 * 多くなりすぎる恐れがある。
	 * ※変換対象オブジェクトが複数の変換を提供するデータの持ち方をしていればよい。
	 * たとえばフォーマットをオブジェクトが持っていればフォーマットごとにConverterを
	 * 作成する必要は無い。
	 *
	 * BeanやBeanから参照されるModelにあたるクラスで，Faceletsページから
	 * 要求される文字列表現を返すtoStringを定義していれば，オブジェクトを文字列で
	 * 保持しなくてもよくなる。しかしtoStringはエラー出力など他の用途でも
	 * 利用されることがありその際に変更されることもあり得る。
	 * toStringを変更した結果Faceletsページの表示結果が意図せず変わってしまう
	 * かもしれない。そのような状況を避けようとするとtoStringに変更を加えにくくなり
	 * 開発効率を落としてしまうかもしれない。すなわちBean(Control)やModelに
	 * View(Faceletsページ)の都合に合わせたtoStringを定義するべきでない。
	 * そもそもList<String>やMap<String, String>が要求された場合はtoStringでは
	 * 対応できない。
	 * そこでBeanあるいはBeanで使用されるサービス的なクラスに，BeanやBeanから
	 * 参照されるModelのFaceletsページの都合に合わせた文字列表現を返すメソッドを定義する。
	 * StateInfo.getCityNameMapはそういうメソッドである。
	 * 
	 * 引数のstateNameがstatesに存在しないStateの名前だった場合は空のMapオブジェクトが返される。
	 * 結果としてFaceletsページの要素は空を示す表現になる。
	 */
	public Map<String, String> getCityNameMap(String stateName) {
		return states.stream()
			.filter(state -> state.getName().equalsIgnoreCase(stateName))
			.flatMap(targetState -> targetState.getCities().stream())
			.collect(Collectors.toMap(City::getName, City::getPopulation));
	}

}
