package practicejsf.bean;

import java.io.Serializable;
import java.util.Locale;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;

@ManagedBean
@SessionScoped
public class LocaleBean implements Serializable {
	
	private static final long serialVersionUID = 9174528940017324L;
	
	private static final Locale ENGLISH = new Locale("en", "US");
	private static final Locale JAPANESE = new Locale("ja", "JP");
	
	private Locale currentLocale = ENGLISH;

	public Locale getCurrentLocale() {
		return currentLocale;
	}
	
	public String setEnglish(){
		currentLocale = ENGLISH;
		/**
		 * 現在のページを再表示させて最新のロケール設定を反映する。
		 */
		return null;
	}
	
	public String setJapanese(){
		currentLocale = JAPANESE;
		return null;
	}
	
}
