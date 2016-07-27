package practicejsf.bean;

import javax.faces.bean.ManagedBean;

@ManagedBean(name = "colors2")
public class OtherLinkSelectedColors extends SelectedColors {

	@Override
	public String showColors() {
		return "other-colors";
	}
	
}
