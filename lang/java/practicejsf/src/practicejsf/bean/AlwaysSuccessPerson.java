package practicejsf.bean;

import javax.faces.bean.ManagedBean;

@ManagedBean(name = "person1")
public class AlwaysSuccessPerson extends Person {
	
	public AlwaysSuccessPerson() {
		this("あいう", "えおたろう", "aiueo@hapoo.ne.jp");
	}
	
	public AlwaysSuccessPerson(String firstName, String lastName, 
		String emailAddress) {
		super(firstName, lastName, emailAddress);
	}
	
	@Override
	public String doRegistration() {
		return "registration-success";
	}
	
}
