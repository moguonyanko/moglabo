package practicejsf.bean;

import java.io.Serializable;

import javax.faces.flow.FlowScoped;
import javax.inject.Named;

@Named
@FlowScoped("flow2")
public class Flow2Bean implements Serializable {

	private static final long serialVersionUID = 826131418953L;

	private String firstName;
	private String lastName;
	private int pagesViewed = 1;

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public int getPagesViewed() {
		return pagesViewed++;
	}

	public String doFlow() {
		if (Math.random() > 0.5) {
			return "confirmation1";
		} else {
			return "confirmation2";
		}
	}

}
