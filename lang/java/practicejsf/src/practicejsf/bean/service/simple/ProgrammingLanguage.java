package practicejsf.bean.service.simple;

import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public enum ProgrammingLanguage {

	/**
	 * 列挙子を示す文字列はクライアントが直接指定しないようにする。
	 * 列挙子はプログラム内部の表現なので外から指定させる仕組みにしてしまうと
	 * あとで変更するのが難しくなる。
	 */
	JAVA(7, "Java"),
	JAVASCRIPT(9, "JavaScript"),
	C(8, "C"),
	CPP(4, "C++"),
	CSHARP(6, "C#"),
	SCHEME(10, "Scheme"),
	PYTHON(5, "Python"),
	SWIFT(3, "Swift");

	private final int popularity;
	private final String displayName;

	private ProgrammingLanguage(int popularity, String displayName) {
		this.popularity = popularity;
		this.displayName = displayName;
	}

	private int getPopularity() {
		return popularity;
	}

	private static List<ProgrammingLanguage> getSortedLanguagesByPopularity() {
		return Stream.of(values())
			.sorted(Comparator.comparing(ProgrammingLanguage::getPopularity).reversed())
			.collect(Collectors.toList());
	}

	public static ProgrammingLanguage findPopularLanguage(int popularitySequenceNo) {
		List<ProgrammingLanguage> langs = getSortedLanguagesByPopularity();

		try {
			return langs.get(popularitySequenceNo - 1);
		} catch (IndexOutOfBoundsException ie) {
			throw new IllegalArgumentException(ie);
		}
	}
	
	public static List<ProgrammingLanguage> randomLanguages(int size){
		List<ProgrammingLanguage> langs = Arrays.asList(values());
		Collections.shuffle(langs);
		List<ProgrammingLanguage> subList = langs.subList(0, size);
		
		return subList;
	}

	public String getDisplayName() {
		return displayName;
	}
	
	@Override
	public String toString() {
		return getDisplayName();
	}

	/**
	 * ManagedBeanアノテーションが指定されていないクラスのgetterも
	 * プロパティ形式で参照できる。getRealNameならrealNameで参照できる。
	 */
	public String getNameAsValue() {
		return name().toUpperCase();
	}
	
	public static ProgrammingLanguage parse(String displayName){
		return Stream.of(values())
			.filter(lang -> lang.displayName.equalsIgnoreCase(displayName))
			.findFirst()
			.orElseThrow(() -> new IllegalArgumentException("言語名が不正です。:" + displayName));
	}

}
