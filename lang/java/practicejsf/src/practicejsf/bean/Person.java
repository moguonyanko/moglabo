package practicejsf.bean;

import java.util.Objects;

import practicejsf.bean.type.Nameable;

public abstract class Person implements Nameable {

	private String firstName;
	private String lastName;
	private String emailAddress;
	
	public Person(String firstName, String lastName, String emailAddress) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.emailAddress = emailAddress;
	}
	
	public Person() {
		this("", "", "");
	}

	@Override
	public String getFirstName() {
		return firstName;
	}

	@Override
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	@Override
	public String getLastName() {
		return lastName;
	}

	@Override
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getFullName() {
		return firstName + " " + lastName;
	}
	
	public String getEmailAddress() {
		return emailAddress;
	}

	public void setEmailAddress(String emailAddress) {
		this.emailAddress = emailAddress;
	}

	public abstract String doRegistration();

	@Override
	public boolean equals(Object obj) {
		if(obj instanceof Person){
			Person another = (Person)obj;
			
			return firstName.equalsIgnoreCase(another.firstName) && 
				lastName.equalsIgnoreCase(another.lastName);
		}else{
			return false;
		}
	}

	@Override
	public int hashCode() {
		return Objects.hash(firstName, lastName);
	}

}
