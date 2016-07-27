package practicejsf.bean;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.faces.bean.ApplicationScoped;

import javax.faces.bean.ManagedBean;

import practicejsf.util.Faces;

@ManagedBean
@ApplicationScoped
public class ColorOptions {

	private static final String[] SAFE_COLOR_NAMES = {
		"red",
		"orange",
		"yellow",
		"green",
		"blue",
		"purple"
	};

	private static final List<String> SAFE_COLOR_VALUES = Arrays.asList(
		"#ff0000",
		"#ffa500",
		"#ffff00",
		"#008000",
		"#0000ff",
		"#800080"
	);

	private final Map<String, String> colorMap;
	private final List<Color> colorList;

	public ColorOptions() {
		colorMap = Faces.toMap(Arrays.asList(SAFE_COLOR_NAMES), SAFE_COLOR_VALUES);

		colorList = colorMap.keySet().stream()
			.map(colorName -> new Color(colorName, colorMap.get(colorName)))
			.collect(Collectors.toList());
	}

	public Map<String, String> getColorMap() {
		return new HashMap<>(colorMap);
	}

	public List<Color> getColorList() {
		return new ArrayList<>(colorList);
	}

	public String[] getColorNames() {
		return SAFE_COLOR_NAMES.clone();
	}

	public List<String> getColorValues() {
		return new ArrayList<>(SAFE_COLOR_VALUES);
	}

}
