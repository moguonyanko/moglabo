package practicejsf.model;

/**
 * 街を表すModelにあたるクラス
 */
public class City {

	private final String name;
	private final String population;

	public City(String name, String population) {
		this.name = name;
		this.population = population;
	}

	public String getName() {
		return name;
	}

	public String getPopulation() {
		return population;
	}

}
