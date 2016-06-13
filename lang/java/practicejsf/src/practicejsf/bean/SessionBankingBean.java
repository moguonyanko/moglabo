package practicejsf.bean;

import java.io.Serializable;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;

/**
 * スーパークラスのBeanがRequestScopedだとサブクラスのBeanをSessionScopedにしても
 * セッションにサブクラスのBeanオブジェクトを保存することができない。
 * SessionScopedなBeanのフィールドはSerializableでなくても
 * セッションにオブジェクトを保存することはできる。
 */
@ManagedBean(name = "bankingBean2")
@SessionScoped
public class SessionBankingBean implements Serializable {

	private static final long serialVersionUID = -3190274996235L;
	
	private final BankingBean bankingBean;

	public SessionBankingBean() {
		this.bankingBean = new BankingBean();
	}
	
	public String getCustomerId() {
		return bankingBean.getCustomerId();
	}

	public void setCustomerId(String customerId) {
		bankingBean.setCustomerId(customerId);
	}

	public String getPassword() {
		return bankingBean.getPassword();
	}

	public void setPassword(String password) {
		bankingBean.setPassword(password);
	}

	public Customer getCustomer() {
		return bankingBean.getCustomer();
	}
	
	public String showBalance() {
		String targetPage = bankingBean.showBalance();
		return targetPage + "-session";
	}

}
