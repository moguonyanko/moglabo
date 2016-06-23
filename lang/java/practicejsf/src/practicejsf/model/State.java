package practicejsf.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * 州を表すModelにあたるクラス
 */
public class State {

	private final String name;
	private final List<City> cities = new ArrayList<>();

	public State(String name, City... cities) {
		this.name = name;
		this.cities.addAll(Arrays.asList(cities));
	}

	public String getName() {
		return name;
	}

	public List<City> getCities() {
		return new ArrayList<>(cities);
	}

}

