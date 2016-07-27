package practicejsf.bean;

import javax.faces.application.FacesMessage;
import javax.faces.bean.ManagedBean;
import javax.faces.context.FacesContext;

import practicejsf.bean.type.WriteinBallot;
import practicejsf.util.Faces;

@ManagedBean
public class MarylandBallot extends WriteinBallot {

	public MarylandBallot() {
		super("Java教育は必要だ", "JavaScript教育は必要だ");
	}
	
	public String checkBallot() {
		Person president = getPresident();
		Person vicePresident = getVicePresident();
		
		if(!president.equals(vicePresident)){
			return "show-ballot-vote";
		}else{
			String content = "プレジデントとバイスプレジデントは同じ人に投票してはいけません！";
			FacesMessage msg = Faces.createErrorMessage(content);
			FacesContext.getCurrentInstance().addMessage(null, msg);
			
			return null;
		}
	}
	
}
