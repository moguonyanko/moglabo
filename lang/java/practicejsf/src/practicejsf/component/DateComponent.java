package practicejsf.component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Date;

import javax.faces.component.FacesComponent;
import javax.faces.component.NamingContainer;
import javax.faces.component.UIInput;
import javax.faces.context.FacesContext;
import javax.faces.convert.ConverterException;

import practicejsf.util.Faces;

@FacesComponent("practicejsf.component.DateComponent1")
public class DateComponent extends UIInput implements NamingContainer {

	private static final String DAY_ID = "day";
	private static final String MONTH_ID = "month";
	private static final String YEAR_ID = "year";

	/**
	 * 返すパッケージ名が誤っていると複合コンポーネントに定義した要素がFaceletsページに出力されない。
	 */
	@Override
	public String getFamily() {
		return "javax.faces.NamingContainer";
	}

	@Override
	public Object getSubmittedValue() {
		return this;
	}

	private UIInput getUIInput(String id) {
		return (UIInput) findComponent(id);
	}

	private int getSubmittedDateValue(UIInput input) {
		try {
			int value = Integer.parseInt(input.getSubmittedValue().toString());
			return value;
		} catch (NumberFormatException ex) {
			throw new ConverterException(Faces.createErrorMessage(ex));
		}
	}

	@Override
	public void encodeBegin(FacesContext context) throws IOException {
		Date date = (Date) getValue();
		LocalDateTime localDateTime = Faces.getLocalDateTimeByDate(date);

		UIInput dayComponent = getUIInput(DAY_ID);
		UIInput monthComponent = getUIInput(MONTH_ID);
		UIInput yearComponent = getUIInput(YEAR_ID);

		dayComponent.setValue(localDateTime.getDayOfMonth());
		monthComponent.setValue(localDateTime.getMonthValue());
		yearComponent.setValue(localDateTime.getYear());

		super.encodeBegin(context);
	}

	@Override
	protected Object getConvertedValue(FacesContext context, Object newSubmittedValue)
		throws ConverterException {
		UIInput dayComponent = getUIInput(DAY_ID);
		UIInput monthComponent = getUIInput(MONTH_ID);
		UIInput yearComponent = getUIInput(YEAR_ID);

		int day = getSubmittedDateValue(dayComponent);
		int month = getSubmittedDateValue(monthComponent);
		int year = getSubmittedDateValue(yearComponent);

		LocalDateTime localDateTime = LocalDateTime.of(year, month, day, 0, 0);

		return Faces.getDateByLocalDateTime(localDateTime);
	}

}
