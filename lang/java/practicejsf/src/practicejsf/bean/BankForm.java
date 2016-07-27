package practicejsf.bean;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import javax.enterprise.context.SessionScoped;
import javax.faces.context.FacesContext;
import javax.inject.Named;

import practicejsf.bean.service.CustomerLookupService;
import practicejsf.bean.service.simple.CustomerSimpleMap;
import practicejsf.util.Faces;

@Named
@SessionScoped
public class BankForm implements Serializable {

	private String customerId = "";
	private String password = "";

	private Customer customer;

	private static final CustomerLookupService LOOKUP_SERVICE = new CustomerSimpleMap();

	private static final String SAMPLE_PASSWORD = "secret";

	public BankForm() {
		customer = new Customer(customerId, "", "", 0);
	}

	public Customer getCustomer() {
		return customer;
	}

	public void setCustomer(Customer customer) {
		this.customer = customer;
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String findBalance() {
		return findUserBalance(true);
	}

	String findUserBalance(boolean checkPassword) {
		customer = LOOKUP_SERVICE.findCustomer(customerId);

		Map<String, String> errorMsgs = new HashMap<>();

		if (customer == null) {
			errorMsgs.put("customerId", String.format("無効なIDです: %s", customerId));
		}

		if (checkPassword && !SAMPLE_PASSWORD.equals(password)) {
			errorMsgs.put("password", "パスワードが間違っています");
		}

		if (errorMsgs.isEmpty()) {
			return "show-customer";
		} else {
			FacesContext context = FacesContext.getCurrentInstance();
			errorMsgs.keySet().stream()
				.forEach(key -> {
					context.addMessage(key, Faces.createErrorMessage(errorMsgs.get(key)));
				});

			return null;
		}
	}

	public Customer findCustomer(String customerId) {
		return LOOKUP_SERVICE.findCustomer(customerId);
	}

}
