package practicejsf.bean;

import java.util.Objects;

public abstract class Employee {
	
	private final Name name;
	private final Company company;

	public Employee(Name name, Company company) {
		this.name = name;
		this.company = company;
	}

	public Name getName() {
		return name;
	}

	public Company getCompany() {
		return company;
	}

	@Override
	public boolean equals(Object obj) {
		if(obj instanceof Employee) {
			Employee another = (Employee)obj;
			return name.equals(another.name) && company.equals(another.company);
		}
		
		return false;
	}

	@Override
	public int hashCode() {
		return Objects.hash(name, company);
	}
	
}
