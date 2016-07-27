package practicejsf.converter;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.convert.Converter;
import javax.faces.convert.ConverterException;
import javax.faces.convert.FacesConverter;

@FacesConverter(value = "localDateConverter")
public class LocalDateConverter implements Converter {

	private static final String LOCAL_DATE_FORMAT = "yyyy/MM/dd";
	private static final DateTimeFormatter LOCAL_DATE_FORMATTER = DateTimeFormatter.ofPattern(LOCAL_DATE_FORMAT);

	@Override
	public Object getAsObject(FacesContext fc, UIComponent uic, String string) {
		try {
			return LocalDate.parse(string, LOCAL_DATE_FORMATTER);
		} catch (DateTimeParseException ex) {
			String messageContent = ex.getMessage() + ":" + ex.getParsedString();
			FacesMessage message = new FacesMessage(messageContent);
			message.setSeverity(FacesMessage.SEVERITY_ERROR);
			/**
			 * FacesContext.getCurrentInstance().addMessageを呼び出さなくても
			 * ConverterExceptionをスローすればFaceletsページに変換エラーメッセージを
			 * 出力することができる。h:inputText等にconverterMessage属性が
			 * 指定されていた場合はFacesMessageコンストラクタの引数に渡した
			 * メッセージは無視される。
			 */
			throw new ConverterException(message);
		}
	}

	@Override
	public String getAsString(FacesContext fc, UIComponent uic, Object o) {
		LocalDate localDate = (LocalDate) o;
		return localDate.format(LOCAL_DATE_FORMATTER);
	}

}
