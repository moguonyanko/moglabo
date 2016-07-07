package practicejsf.bean;

import java.io.Serializable;
import java.util.List;
import java.util.stream.Collectors;

public class Programmer implements Serializable {
	
	private static final long serialVersionUID = -87623056921L;

	public enum Level {
		JUNIOR, INTERMEDIATE;
	}

	private final String firstName;
	private final String lastName;
	private Level level;
	private final double salary;
	private final List<String> languages;
	
	private boolean levelEditable;

	public Programmer(String firstName, String lastName, Level level,
		double salary, List<String> languages) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.level = level;
		this.salary = salary;
		this.languages = languages;
	}

	public String getFirstName() {
		return firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public Level getLevel() {
		return level;
	}

	public void setLevel(Level level) {
		levelEditable = false;
		this.level = level;
	}
	
	public boolean isLevelEditable() {
		return levelEditable;
	}

	public void setLevelEditable(boolean levelEditable) {
		this.levelEditable = levelEditable;
	}

	public double getSalary() {
		return salary;
	}

	public List<String> getLanguages() {
		return languages.stream().collect(Collectors.toList());
	}
	
	public String getFormattedSalary() {
		return String.format("\\,.2f", getSalary());
	}

	public String getJoinedLanguages() {
		List<String> langsWithoutLastLang = languages.subList(0, languages.size() - 2);
		
		String lastLang = languages.get(languages.size() - 1);
		String tmp = langsWithoutLastLang.stream().collect(Collectors.joining(", "));
		String result = tmp + " and " + lastLang;
		
		return result;
	}
	
}
