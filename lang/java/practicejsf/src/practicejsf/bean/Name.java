package practicejsf.bean;

import java.util.Objects;

public class Name {

	private final String firstName;
	private final String lastName;

	public Name(String firstName, String lastName) {
		this.firstName = firstName;
		this.lastName = lastName;
	}
	
	public String getFirstName() {
		return firstName;
	}

	public String getLastName() {
		return lastName;
	}

	@Override
	public boolean equals(Object obj) {
		if(obj instanceof Name){
			Name another = (Name)obj;
			return firstName.equalsIgnoreCase(another.firstName) && 
				lastName.equalsIgnoreCase(another.lastName);
		}
		
		return false;
	}

	@Override
	public int hashCode() {
		return Objects.hash(firstName, lastName);
	}
	
}
