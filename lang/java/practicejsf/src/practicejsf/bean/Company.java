package practicejsf.bean;

import java.util.Objects;

public class Company {

	private final String companyName;
	private final String business;

	public Company(String companyName, String business) {
		this.companyName = companyName;
		this.business = business;
	}

	public String getCompanyName() {
		return companyName;
	}

	public String getBusiness() {
		return business;
	}

	@Override
	public boolean equals(Object obj) {
		if (obj instanceof Company) {
			Company another = (Company) obj;
			return companyName.equalsIgnoreCase(another.companyName)
				&& business.equalsIgnoreCase(another.business);
		}

		return false;
	}

	@Override
	public int hashCode() {
		return Objects.hash(companyName, business);
	}

}
