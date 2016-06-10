package practicejsf.converter;

import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.convert.Converter;
import javax.faces.convert.FacesConverter;

import practicejsf.bean.service.simple.ProgrammingLanguage;

@FacesConverter(value = "pgLangConverter")
public class ProgrammingLanguageConverter implements Converter {

	@Override
	public Object getAsObject(FacesContext fc, UIComponent uic, String inputLangName) {
		return ProgrammingLanguage.parse(inputLangName);
	}

	@Override
	public String getAsString(FacesContext fc, UIComponent uic, Object o) {
		ProgrammingLanguage lang = (ProgrammingLanguage)o;
		return lang.getDisplayName();
	}

}
