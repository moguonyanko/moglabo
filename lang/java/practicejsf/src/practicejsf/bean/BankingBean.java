package practicejsf.bean;

import java.io.Serializable;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.ManagedProperty;
import javax.faces.bean.RequestScoped;

import practicejsf.bean.service.CustomerLookupService;
import practicejsf.util.Faces;

/**
 * Beanはコントローラ(Controler)となる。
 */
@ManagedBean
@RequestScoped
public class BankingBean implements Serializable {
	
	private static final long serialVersionUID = 943008722123L;

	private String customerId;
	private String password;

	/**
	 * このCustomerはモデル(Model)となる。
	 */
	private Customer customer;
	
	/**
	 * BankingBeanがManagedBeanとして参照された時しかManagedPropertyは設定されない。
	 * つまりBankingBeanをメンバとして持つクラスがインスタンス化されたとしても
	 * BankingBeanのManagedPropertyは設定されない。ただし別のBeanのManagedProperty経由で
	 * BankingBeanが初期化された時は設定される。
	 */
	@ManagedProperty(value = "#{currentLookupService}")
	private transient CustomerLookupService service;

	private static final String SAMPLE_PASSWORD = "secret";

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		if (!Faces.isNullOrEmpty(customerId)) {
			this.customerId = customerId.trim();
		} else {
			this.customerId = "(none entered)";
		}
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Customer getCustomer() {
		return customer;
	}
	
	/**
	 * このshowBalanceメソッドはビュー(View)となるページの名前を返す。
	 * 返されるページ名を元に<strong>相対パス</strong>でページを検索し遷移する。
	 */
	public String showBalance() {
		if (Faces.isNullOrEmpty(password) || !SAMPLE_PASSWORD.equals(password)) {
			return "wrong-password";
		}

		customer = service.findCustomer(customerId);

		if (customer == null) {
			return "unknown-customer";
		}

		double balance = customer.getBalanceNoSign();

		if (balance < 0) {
			return "negative-balance";
		} else if (balance < 10000) {
			return "normal-balance";
		} else {
			return "high-balance";
		}
	}

	public void setService(CustomerLookupService service) {
		this.service = service;
	}

}
