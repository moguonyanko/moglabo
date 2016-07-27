package practicejsf.bean;

import java.io.Serializable;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;

import practicejsf.util.Faces;

@ManagedBean
@SessionScoped
public class ColorPreferences implements Serializable {

	private String foreGround = "black";
	private String backGround = "#ccffcc";

	private static final String STYLE_FORMAT = "color: %s; background-color: %s;";
	
	public String getForeGround() {
		return foreGround;
	}

	public void setForeGround(String foreGround) {
		if (!Faces.isNullOrEmpty(foreGround)) {
			this.foreGround = foreGround;
		}
	}

	public String getBackGround() {
		return backGround;
	}

	public void setBackGround(String backGround) {
		if (!Faces.isNullOrEmpty(backGround)) {
			this.backGround = backGround;
		}
	}

	public String getStyle() {
		return String.format(STYLE_FORMAT, foreGround, backGround);
	}
	
}
