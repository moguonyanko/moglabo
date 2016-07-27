package practicejsf.bean;

import javax.faces.bean.ManagedBean;

import practicejsf.util.Faces;

@ManagedBean
public class ColorPallet {
	
	private static final String[] FORE_GROUNDS = {
		"deepskyblue", "oldlace", "coral", "indigo"
	};
	
	private static final String[] BACK_GROUNDS = {
		"greenyellow", "purple", "tomato", "lightsteelblue"
	};
	
	public String getRandomForeground() {
		return Faces.getRandomElement(FORE_GROUNDS);
	}

	public String getRandomBackground() {
		return Faces.getRandomElement(BACK_GROUNDS);
	}
	
}
