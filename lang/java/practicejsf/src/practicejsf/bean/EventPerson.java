package practicejsf.bean;

import java.util.stream.Stream;

import javax.faces.bean.ManagedBean;

import practicejsf.util.Faces;

@ManagedBean(name = "person3")
public class EventPerson extends Person {

	public EventPerson() {
		super("Usao", "Ahhh", "usao-a@myhome.ne.hoge");
	}

	@Override
	public String doRegistration() {
		String[] profileValues = 
			new String[]{getFirstName(), getLastName(), getEmailAddress()};
		if (Stream.of(profileValues).anyMatch(Faces::isNullOrEmpty)) {
			return "missing-input";
		} else {
			return "confirm-registration";
		}
	}

}
