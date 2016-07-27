package practicejsf.bean.service;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Stream;
import static java.util.stream.Collectors.*;

import practicejsf.util.Faces;

public enum SupportedLocale {
	ENGLISH(new Locale("en", "US"), "English"),
	JAPANESE(new Locale("ja", "JP"), "日本語");

	private final Locale locale;
	private final String localeSymbolName;
	
	private static final String LOCALE_SEPARATOR = "-";

	private static final SupportedLocale DEFAULT_SUPPORTED_LOCALE = JAPANESE;
	private static final Locale DEFAULT_LOCALE = DEFAULT_SUPPORTED_LOCALE.getLocale();

	private SupportedLocale(Locale locale, String localeSymbolName) {
		this.locale = locale;
		this.localeSymbolName = localeSymbolName;
	}

	public Locale getLocale() {
		return locale;
	}

	private String getLocaleSymbolName() {
		return localeSymbolName;
	}
	
	private String getLocaleParameter() {
		String language = getLocale().getLanguage();
		String country = getLocale().getCountry();
		
		return language + LOCALE_SEPARATOR + country;
	}

	public static Locale getLocaleExceptNow(Locale nowLocale) {
		List<SupportedLocale> supportLocales = Stream.of(values())
			.filter(l -> !l.getLocale().equals(nowLocale))
			.collect(toList());

		return Faces.getRandomElement(supportLocales).getLocale();
	}

	public static Locale getDefault() {
		return DEFAULT_LOCALE;
	}

	public static Locale parse(String localeParam) {
		String[] params = localeParam.split(LOCALE_SEPARATOR);
		Locale targetLocale = new Locale(params[0], params[1]);

		return Stream.of(values())
			.filter(sl -> sl.getLocale().equals(targetLocale))
			.findFirst()
			.orElse(DEFAULT_SUPPORTED_LOCALE)
			.getLocale();
	}
	
	public static Map<String, String> getLocaleParameters() {
		return Stream.of(values())
			.collect(toMap(SupportedLocale::getLocaleSymbolName, SupportedLocale::getLocaleParameter));
	}
}
