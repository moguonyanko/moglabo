package practicejsf.bean;

import java.util.Date;

import javax.faces.bean.ManagedBean;

import practicejsf.util.Faces;

@ManagedBean(name = "resortBean2")
public class SubResortBean extends ResortBean {

	@Override
	public void setStartDate(Date startDate) {
		super.setStartDate(Faces.getNextDate(startDate));
	}

	@Override
	public void setEndDate(Date endDate) {
		super.setEndDate(Faces.getNextDate(endDate));
	}

	@Override
	public String register() {
		String outcome = super.register();

		if (outcome != null) {
			return "show-rich-dates";
		} else {
			return outcome;
		}
	}

}
