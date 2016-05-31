package practicejsf.util;

import java.util.Map;

import javax.faces.context.FacesContext;

public final class Faces {

	public static <T> T getData(String key, Class<T> klass) {
		FacesContext context = FacesContext.getCurrentInstance();
		Map<String, Object> sessionMap = context.getExternalContext().getSessionMap();
		Object o = sessionMap.get(key);

		if (klass.isInstance(o)) {
			return klass.cast(o);
		} else {
			return null;
		}
	}

}
