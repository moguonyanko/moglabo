package practicejsf.bean;

import java.io.Serializable;

public class Customer implements Serializable {
	
	private String id;
	private String firstName;
	private String lastName;
	private double balanceNoSign;
	
	public Customer(String id, String firstName, String lastName, double balanceNoSign) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.balanceNoSign = balanceNoSign;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
	
	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public double getBalanceNoSign() {
		return balanceNoSign;
	}

	public void setBalanceNoSign(double balanceNoSign) {
		this.balanceNoSign = balanceNoSign;
	}
	
}
