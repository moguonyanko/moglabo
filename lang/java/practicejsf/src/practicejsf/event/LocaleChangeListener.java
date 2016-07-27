package practicejsf.event;

import java.util.Map;

import javax.faces.context.FacesContext;
import javax.faces.event.ValueChangeEvent;
import javax.faces.event.ValueChangeListener;

import practicejsf.bean.UserLocale;

public class LocaleChangeListener implements ValueChangeListener {

	@Override
	public void processValueChange(ValueChangeEvent event) {
		FacesContext context = FacesContext.getCurrentInstance();
		Map<String, Object> sessionMap = context.getExternalContext().getSessionMap();
		/**
		 * 例えばUserLocaleがRequestScopedだとgetの戻り値はnullになっている。
		 */
		UserLocale userData = (UserLocale)sessionMap.get("userLocale");
		userData.setSelectedCountry(event.getNewValue().toString());
	}
	
}
