package practicejsf.bean;

import javax.faces.bean.ManagedBean;

/**
 * 何も指定しない場合はリクエストスコープになる。
 * nameでBean名を指定した場合，デフォルトで使われるキャメルスタイルのBean名は
 * 使用できなくなる。このクラスならselectColorsはBean名として使えない。
 */
@ManagedBean(name = "colors1")
public class SelectedColors {

	private String color1, color2, color3, color4;

	public final String getColor1() {
		return color1;
	}

	public final void setColor1(String color1) {
		this.color1 = color1;
	}

	public final String getColor2() {
		return color2;
	}

	public final void setColor2(String color2) {
		this.color2 = color2;
	}

	public final String getColor3() {
		return color3;
	}

	public final void setColor3(String color3) {
		this.color3 = color3;
	}

	public final String getColor4() {
		return color4;
	}

	public final void setColor4(String color4) {
		this.color4 = color4;
	}

	public String showColors() {
		return "show-colors";
	}
	
}
