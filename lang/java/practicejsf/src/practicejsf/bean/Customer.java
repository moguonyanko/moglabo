package practicejsf.bean;

public class Customer {
	
	private final String id;
	private final String firstName;
	private final String lastName;
	private final double balanceNoSign;

	public Customer(String id, String firstName, String lastName, double balanceNoSign) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.balanceNoSign = balanceNoSign;
	}

	public String getId() {
		return id;
	}

	public String getFirstName() {
		return firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public double getBalanceNoSign() {
		return balanceNoSign;
	}
	
}
