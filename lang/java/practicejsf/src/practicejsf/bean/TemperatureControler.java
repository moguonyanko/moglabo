package practicejsf.bean;

import javax.faces.bean.ManagedBean;

@ManagedBean
public class TemperatureControler {

	private String ctemp;
	private String ktemp;

	public String getCtemp() {
		return ctemp;
	}

	public String getKtemp() {
		return ktemp;
	}
	
	public String getFtemp() {
		return "";
	}

	public void setFtemp(String ftemp) {
		double f = -500;

		try {
			f = Double.parseDouble(ftemp);
		} catch (NumberFormatException ex) {
			ctemp = "Invalid";
			ktemp = "Invalid";
		}

		if (f >= -459.4) {
			double c = (f - 32) * (5.0 / 9.0);
			double k = c + 273;
			ctemp = String.format("%.2f", c);
			ktemp = String.format("%.2f", k);
		}
	}

}
