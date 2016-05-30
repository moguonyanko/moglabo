package practicejsf.bean;

import java.util.HashMap;
import java.util.Map;

enum LocaleType {
	JAPAN("ja", "Japan"),
	UNITEDKINGDOM("en", "United Kingdom"),
	GERMAN("de", "German"),
	FRENCH("fr", "French");
	
	private final String id;
	private final String localeTypeName;

	private LocaleType(String id, String localeTypeName) {
		this.id = id;
		this.localeTypeName = localeTypeName;
	}
	
	private static final LocaleType DEFAULT_LOCALE_TYPE = JAPAN;
	
	public static LocaleType getDefaultLocaleType() {
		return DEFAULT_LOCALE_TYPE;
	}
	
	public String getLocaleTypeName() {
		return localeTypeName;
	}
	
	public static Map<String, String> getLocaleNameMap() {
		Map<String, String> locales = new HashMap<String, String>();
		
		for(LocaleType type : values()){
			locales.put(type.id, type.localeTypeName);
		}
		
		return locales;
	}
	
}
