package practicejsf.bean;

import java.io.Serializable;
import java.util.Map;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.faces.event.ActionEvent;
import javax.faces.event.ComponentSystemEvent;
import javax.faces.event.ValueChangeEvent;

/**
 * SessionScopedが指定されているにも関わらずマネージドBeanがシリアライズ可能でない場合，
 * そのBeanを参照するページにアクセスするためのURLにセッションIDが付与される。
 * この仕組みのおかげでBeanがシリアライズ可能でなくてもWebページの処理を行うことができる。
 * ただしその場合でもアプリケーションサーバのログにBeanのシリアライズに関する警告は出力される。
 */
@ManagedBean(name = "userLocale", eager = true)
@SessionScoped
public class UserLocale implements Serializable {
	
	private static final long serialVersionUID = -7987785540351434870L;
	
	private LocaleType localeType;

	public UserLocale() {
		initLocaleType();
	}
	
	public void localeChanged(ValueChangeEvent event) {
		localeType = LocaleType.parseByLocaleTypeName(event.getNewValue().toString());
	}
	
	public Map<String, String> getCountries() {
		return LocaleType.getLocaleNameMap();
	}

	public String getSelectedCountry() {
		return localeType.getLocaleTypeName();
	}

	/**
	 * JSFからは文字列が送られてくるはずなのでシグネチャをString以外には
	 * できないかもしれない。なるべく早くString以外の型に変換して保持する。
	 */
	public void setSelectedCountry(String selectedCountry) {
		localeType = LocaleType.parseByLocaleTypeName(selectedCountry);
	}

	public String getGreeting() {
		return localeType.getGreeting();
	}

	public void setGreeting(String greeting) {
		localeType = LocaleType.parseByGreeting(greeting);
	}
	
	public void changeHello(ActionEvent event){
		localeType = LocaleType.UNITEDKINGDOM;
	}
	
	/**
	 * 遷移先のページの名前を返すだけで遷移が行われる。
	 */
	public String changeResultPage() {
		return "helloworld";
	}
	
	private void initLocaleType() {
		localeType = LocaleType.getDefaultLocaleType();
	}
	
	public void initialize(ComponentSystemEvent event) {
		initLocaleType();
	}
	
}
