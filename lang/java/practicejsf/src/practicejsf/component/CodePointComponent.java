package practicejsf.component;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponentBase;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;

@FacesComponent(createTag = true, tagName = "codePoint")
public class CodePointComponent extends UIComponentBase {

	@Override
	public String getFamily() {
		return "practicejsf.component";
	}
	
	private void writeCodePoint(ResponseWriter writer, int cp) {
		try {
			writer.write("<span>" + String.valueOf(cp) + "</span>");
		} catch (IOException ex) {
			throw new IllegalStateException(ex);
		}
	}

	@Override
	public void encodeBegin(FacesContext context) throws IOException {
		String value = (String) getAttributes().get("value");

		if (value != null) {
			ResponseWriter writer = context.getResponseWriter();

			value.codePoints()
				.forEach(cp -> writeCodePoint(writer, cp));
		}
	}

}
