package practicejsf.bean;

import java.io.Serializable;
import java.util.Objects;

public class Company implements Serializable {

	private static final long serialVersionUID = 137239200L;

	private String companyName;
	private String business;

	public Company(String companyName, String business) {
		this.companyName = companyName;
		this.business = business;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getBusiness() {
		return business;
	}

	public void setBusiness(String business) {
		this.business = business;
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
