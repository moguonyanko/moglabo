package practicejsf.bean;

import java.util.List;
import java.util.stream.Collectors;

import javax.faces.bean.ManagedBean;

import practicejsf.bean.service.simple.ProgrammingLanguage;

/**
 * Beanのフィールドは極力String型で持たないようにする。
 * String型で保持してしまうと後々変更や機能追加しづらい。
 * 利用しているクラスのtoStringメソッドまたはStringを
 * 返すメソッドを適切に実装することで対応する。
 */
@ManagedBean
public class TrainingForm {

	private String emailAddress;
	private ProgrammingLanguage favoriteLanguage = ProgrammingLanguage.findPopularLanguage(1);
	private ProgrammingLanguage secondFavoriteLanguage = ProgrammingLanguage.findPopularLanguage(2);
	private boolean expert = true;
	private boolean liar = false;
	private List<ProgrammingLanguage> languagesToStudy;

	public ProgrammingLanguage[] getAvailableLanguageNames() {
		return ProgrammingLanguage.values();
	}

	public String showTrainingPlan() {
		int targetLangNum = expert ? 4 : 2;

		if (liar) {
			return "liar";
		} else {
			languagesToStudy = ProgrammingLanguage.randomLanguages(targetLangNum);

			return "study-plan";
		}
	}

	public String getEmailAddress() {
		return emailAddress;
	}

	public void setEmailAddress(String emailAddress) {
		this.emailAddress = emailAddress;
	}

	public ProgrammingLanguage getFavoriteLanguage() {
		return favoriteLanguage;
	}

	/**
	 * フィールドの型・setterの引数の型・getterの戻り値の型は全て同じでないと
	 * フィールドの書き込み時にPropertyNotWritableExceptionが発生する。
	 *
	 * コンバータを使っていない場合，入力された文字列を元にJSFのコンテナ側で
	 * 列挙型から値を検索してきてくれる。そしてその値を引数としてsetterが呼び出される。
	 * 該当する列挙子が存在せず得られなかった時はsetter呼び出し前にエラーになる。
	 */
	public void setFavoriteLanguage(ProgrammingLanguage lang) {
		this.favoriteLanguage = lang;
	}

	public ProgrammingLanguage getSecondFavoriteLanguage() {
		return secondFavoriteLanguage;
	}

	public void setSecondFavoriteLanguage(ProgrammingLanguage lang) {
		this.secondFavoriteLanguage = lang;
	}

	public List<String> getLanguagesToStudy() {
		return languagesToStudy.stream()
			.map(ProgrammingLanguage::toString)
			.collect(Collectors.toList());
	}

	public boolean isExpert() {
		return expert;
	}

	public void setExpert(boolean expert) {
		this.expert = expert;
	}

	public boolean isLiar() {
		return liar;
	}

	public void setLiar(boolean liar) {
		this.liar = liar;
	}

}
