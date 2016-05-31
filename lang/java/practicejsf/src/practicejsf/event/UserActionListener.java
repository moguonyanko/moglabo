package practicejsf.event;

import javax.faces.event.AbortProcessingException;
import javax.faces.event.ActionEvent;
import javax.faces.event.ActionListener;
import practicejsf.bean.UserLocale;
import practicejsf.util.Faces;

public class UserActionListener implements ActionListener {

	@Override
	public void processAction(ActionEvent ae) throws AbortProcessingException {
		UserLocale locale = Faces.getData("userLocale", UserLocale.class);
		locale.setGreeting("Hello");
	}
	
}
