package practicejsf.bean;

import java.util.HashMap;
import java.util.Map;

public enum LocaleType {
	JAPAN("ja", "Japan", "こんにちは"),
	UNITEDKINGDOM("en", "UnitedKingdom", "Hello"),
	GERMAN("de", "German", "Guten Tag"),
	FRENCH("fr", "French", "Bonjour");

	private final String id;
	private final String localeTypeName;
	private final String greeting;

	private LocaleType(String id, String localeTypeName, String greeting) {
		this.id = id;
		this.localeTypeName = localeTypeName;
		this.greeting = greeting;
	}

	private static final LocaleType DEFAULT_LOCALE_TYPE = JAPAN;

	public static LocaleType getDefaultLocaleType() {
		return DEFAULT_LOCALE_TYPE;
	}

	public String getLocaleTypeName() {
		return localeTypeName;
	}

	public String getGreeting() {
		return greeting;
	}

	public static Map<String, String> getLocaleNameMap() {
		Map<String, String> locales = new HashMap<String, String>();

		for (LocaleType type : values()) {
			locales.put(type.id, type.localeTypeName);
		}

		return locales;
	}

	public static LocaleType parseByLocaleTypeName(String name) {
		if (name != null && !name.isEmpty()) {
			return LocaleType.valueOf(name.toUpperCase());
		} else {
			throw new IllegalArgumentException("Illegal locale type:" + name);
		}
	}

	public static LocaleType parseByGreeting(String greeting) {
		for (LocaleType type : values()) {
			if(type.greeting.equalsIgnoreCase(greeting)){
				return type;
			}
		}
		
		throw new IllegalArgumentException("Unknown greeting:" + greeting);
	}

}
