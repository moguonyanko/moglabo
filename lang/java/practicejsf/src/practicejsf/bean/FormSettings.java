package practicejsf.bean;

import java.io.Serializable;
import java.util.Locale;
import java.util.Map;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.faces.event.ActionEvent;
import javax.faces.event.ValueChangeEvent;

import practicejsf.bean.service.SupportedLocale;

@ManagedBean
@SessionScoped
public class FormSettings implements Serializable {

	private static final long serialVersionUID = -9851257622122L;
	
	private boolean isNormalSize = true;
	
	private static final String DEFAULT_LANGUAGE = "ja-JP";
	
	private String selectedLanguage = DEFAULT_LANGUAGE;
	
	private Locale locale = SupportedLocale.parse(selectedLanguage);
	
	/**
	 * styleClass属性に指定されたメソッドはActionEventが発生すると，
	 * ActionEventで何も変更が発生しなかったとしても必ず呼び出される。
	 */
	public String getBodyStyleClass() {
		if (isNormalSize) {
			return "normalsize";
		} else {
			return "largesize";
		}
	}

	public void setNormalSize(ActionEvent event) {
		isNormalSize = true;
	}

	public void setLargeSize(ActionEvent event) {
		isNormalSize = false;
	}

	/**
	 * ActionEventが発生するとFaceletsページがリロードされて
	 * getLocaleが返すロケールに従いページが表示される。
	 * 
	 * actionListener属性を多用するとページのリロードが多発するかもしれない。
	 * valueChangeListener属性についても同じことがいえる。
	 */
	public Locale getLocale() {
		return locale;
	}

	public void setLocale(Locale locale) {
		this.locale = locale;
		/**
		 * JSF2.0までは以下を呼び出さないとロケールの変更が反映できなかったらしい。
		 */
		//FacesContext.getCurrentInstance().getViewRoot().setLocale(locale);
	}
	
	public String getLanguage() {
		return selectedLanguage;
	}

	/**
	 * 例えばsetLanguageを引数無しにするなどして
	 * 引数のシグネチャをString型の変数1つ以外にすると，
	 * languageプロパティは書き込み不可となる。
	 * たとえ引数を使用していなくても書き込みを行うプロパティを
	 * 扱っているならば引数のシグネチャを変更してはいけない。
	 */
	public void setLanguage(String language) {
		setLocale(SupportedLocale.parse(selectedLanguage));
	}

	public void changeRandomLocaleExceptNow(ActionEvent event) {
		setLocale(SupportedLocale.getLocaleExceptNow(locale));
	}

	public Map<String, String> getLanguages() {
		return SupportedLocale.getLocaleParameters();
	}
	
	/**
	 * setLanguageの引数を使ってそのままロケール変更を行う方がシンプルだが
	 * ValueChangeEventの働きを調査するためにわざとupdateLanguageを経由している。
	 * 
	 * Faceletsタグにonclick=submit()を指定すると，値が変更されていなくても
	 * 対象の要素を操作した時にFaceletsページのリロードが発生する。ただし値の変更を
	 * 伴わないならばvalueChangeListener属性に指定したメソッドは呼び出されない。
	 * 
	 * onchange=submit()の場合，対象の要素が変更されていなければページのリロードは
	 * 発生しない。例えばonchange属性が指定された同じh:selectOneRadioを
	 * クリックし続けているだけならページはリロードされない。
	 */
	public void updateLanguage(ValueChangeEvent event){
		selectedLanguage = event.getNewValue().toString();
	}
	
}
