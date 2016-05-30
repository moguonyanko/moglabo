package practicejsf.bean;

import java.io.Serializable;
import java.util.Map;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
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
	
	private static final long serialVersionUID = 494855863L;
	
	private String selectedCountry = LocaleType.getDefaultLocaleType().getLocaleTypeName();
	
	public void localeChanged(ValueChangeEvent event) {
		selectedCountry = event.getNewValue().toString();
	}
	
	public Map<String, String> getCountries() {
		return LocaleType.getLocaleNameMap();
	}

	public String getSelectedCountry() {
		return selectedCountry;
	}

	public void setSelectedCountry(String selectedCountry) {
		this.selectedCountry = selectedCountry;
	}
	
}
