package practicejsf.converter;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.chrono.ChronoLocalDate;
import java.time.chrono.Chronology;
import java.time.chrono.JapaneseChronology;
import java.time.format.DateTimeFormatter;
import java.util.Date;

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
		Date srcDate = (Date)date;
		LocalDate localDate = srcDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
		Chronology jpChrono = JapaneseChronology.INSTANCE;
		String pattern = "Gy年M月d日";
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
		ChronoLocalDate notIsoDate = jpChrono.date(localDate);
		String result = notIsoDate.format(formatter);
		
		return result;
	}
	
}
