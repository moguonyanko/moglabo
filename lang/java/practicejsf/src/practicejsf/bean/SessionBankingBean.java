package practicejsf.bean;

import java.io.Serializable;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;

import practicejsf.bean.service.simple.CustomerSimpleMap;

/**
 * スーパークラスのBeanがRequestScopedだとサブクラスのBeanをSessionScopedにしても
 * セッションにサブクラスのBeanオブジェクトを保存することができない。
 * 
 * SessionScopedなBeanのフィールドがSerializableでないと，
 * アプリケーションサーバ終了時にNotSerializableExceptionが発生する。
 */
@ManagedBean(name = "bankingBean2")
@SessionScoped
public class SessionBankingBean implements Serializable {

	private static final long serialVersionUID = -3190274996235L;
	
	/**
	 * このBean内にbankingBeanフィールドのsetterがあったとしても，
	 * BankingBeanのスコープがこのBeanのスコープよりも小さかった場合は
	 * Beanの初期化中にManagedBeanCreationExceptionが発生して失敗してしまう。
	 * BankingBeanのスコープがSessionBankingBeanのスコープと同じであれば，
	 * ManagedPropertyでbankingBeanフィールドを初期化することができる。
	 * その場合はBankingBean内のManagedPropertyも設定されている。
	 */
	//@ManagedProperty(value = "#{bankingBean}")
	//private BankingBean bankingBean;
	private final BankingBean bankingBean;

	public SessionBankingBean() {
		this.bankingBean = new BankingBean();
		bankingBean.setService(new CustomerSimpleMap());
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

	//public void setBankingBean(BankingBean bankingBean) {
	//	this.bankingBean = bankingBean;
	//}

}
