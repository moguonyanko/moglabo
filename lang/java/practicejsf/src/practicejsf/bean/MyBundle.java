package practicejsf.bean;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.faces.component.UIViewRoot;
import javax.faces.context.FacesContext;
import javax.faces.event.ValueChangeEvent;

import practicejsf.util.Faces;

@ManagedBean(name = "mybundle", eager = true)
@SessionScoped
public class MyBundle implements Serializable {

	private static final long serialVersionUID = -5442270271867718262L;
	
	private String locale;
	private final Map<String, Locale> countries = new HashMap<String, Locale>();
	private final Map<String, Locale> countriesForDisplay = new HashMap<String, Locale>();

	/**
	 * 引数無しコンストラクタが明示的あるいは暗黙で定義されていないと
	 * Beanを参照した際に例外が発生する。
	 */
	public MyBundle() {
		locale = Faces.getApplication().getDefaultLocale().toString();
		
		/**
		 * getSupportedLocalesメソッドはfaces-config.xmlの<supported-locale>で
		 * 指定されたロケール一覧を返す。
		 * 
		 * フィールドをstatic宣言してstatic初期子で初期化すると例外が発生する。
		 */
		Iterator<Locale> iter = Faces.getApplication().getSupportedLocales();
		while (iter.hasNext()) {
			Locale supportedLocale = iter.next();
			countries.put(supportedLocale.toString(), supportedLocale);
			countriesForDisplay.put(supportedLocale.getDisplayCountry(), supportedLocale);
		}
	}

	public String getLocale() {
		return locale;
	}

	public void setLocale(String locale) {
		this.locale = locale;
	}

	/**
	 * RequestScopedにしているとデフォルト値と同じ値に変更した時に
	 * ValueChangeEventが発生しない。
	 */
	public void localeChanged(ValueChangeEvent event) {
		/**
		 * ValueChangeEvent.getNewValueの戻り値はcountriesForDisplayの型に
		 * 関係無くStringになっている。
		 */
		String newLocaleName = event.getNewValue().toString();

		if (countries.containsKey(newLocaleName)) {
			FacesContext context = FacesContext.getCurrentInstance();
			UIViewRoot viewRoot = context.getViewRoot();
			viewRoot.setLocale(countries.get(newLocaleName));
		} 
	}

	public Map<String, Locale> getCountryNames() {
		return countriesForDisplay;
	}

}
