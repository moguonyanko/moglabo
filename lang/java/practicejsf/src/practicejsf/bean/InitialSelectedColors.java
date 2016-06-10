package practicejsf.bean;

import javax.faces.bean.ManagedBean;

@ManagedBean(name = "colors3")
public class InitialSelectedColors extends SelectedColors {

	public InitialSelectedColors() {
		setColor1("orange");
		setColor2("#ff0000");
		setColor3("#008000");
		setColor4("#0000ff");
	}

	@Override
	public String showColors() {
		return "initial-colors";
	}

}
