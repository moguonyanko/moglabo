package practicejsf.converter;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.convert.Converter;
import javax.faces.convert.FacesConverter;

@FacesConverter(value = "jpCalendarConverter")
public class JapaneseCalendarConverter implements Converter {

	@Override
	public Object getAsObject(FacesContext context, UIComponent component, String value) {
		return value;
	}

	@Override
	public String getAsString(FacesContext context, UIComponent component, Object date) {
		Locale jpLocale = new Locale("jp", "JP", "JP");
		Calendar calendar = Calendar.getInstance(jpLocale);
		
		/**
		 * JapaneseImperialCalendarが返されないので和暦に変換がされない。
		 */
		System.out.println(calendar);
		
		calendar.setTime((Date)date);
		SimpleDateFormat formatter = new SimpleDateFormat("GGGGyyyy年MM月dd日");
		
		return formatter.format(calendar.getTime());
	}
	
}
