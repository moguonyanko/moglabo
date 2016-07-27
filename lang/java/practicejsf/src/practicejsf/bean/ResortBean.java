package practicejsf.bean;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

import javax.faces.application.FacesMessage;
import javax.faces.bean.ManagedBean;
import javax.faces.context.FacesContext;

import practicejsf.bean.type.Nameable;
import practicejsf.util.Faces;

@ManagedBean
public class ResortBean implements Nameable {

	private String firstName;
	private String lastName;

	private Date startDate;
	private Date endDate;

	private static final DateTimeFormatter FORMATTER = 
		DateTimeFormatter.ofPattern("yyyy-MM-dd");

	public ResortBean() {
		LocalDateTime start = LocalDateTime.now().plusDays(1);
		startDate = Faces.getDateByLocalDateTime(start);
		LocalDateTime end = LocalDateTime.now().plusDays(1);
		endDate = Faces.getDateByLocalDateTime(end);
	}

	@Override
	public String getFirstName() {
		return firstName;
	}

	@Override
	public void setFirstName(String name) {
		firstName = name;
	}

	@Override
	public String getLastName() {
		return lastName;
	}

	@Override
	public void setLastName(String name) {
		lastName = name;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	private String formatDate(Date date) {
		if (date != null) {
			LocalDateTime localDateTime = Faces.getLocalDateTimeByDate(date);
			return FORMATTER.format(localDateTime);
		} else {
			return "";
		}
	}

	public String getStartDay() {
		return formatDate(startDate);
	}

	public String getEndDay() {
		return formatDate(endDate);
	}

	public String register() {
		if (startDate.before(endDate)) {
			return "show-dates";
		} else {
			FacesContext context = FacesContext.getCurrentInstance();
			FacesMessage errorMessage = Faces.createErrorMessage("出発日は到着日よりも前でなければなりません");
			String outputElementId = "registrationForm:checkoutDate";
			context.addMessage(outputElementId, errorMessage);
			return null;
		}
	}

}
