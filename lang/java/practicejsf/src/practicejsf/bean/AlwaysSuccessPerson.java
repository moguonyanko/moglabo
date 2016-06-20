package practicejsf.bean;

import javax.faces.bean.ManagedBean;

@ManagedBean(name = "person1")
public class AlwaysSuccessPerson extends Person {

	public AlwaysSuccessPerson() {
		super("あいう", "えおたろう", "aiueo@hapoo.ne.jp");
	}

	@Override
	public String doRegistration() {
		return "registration-success";
	}
	
}
