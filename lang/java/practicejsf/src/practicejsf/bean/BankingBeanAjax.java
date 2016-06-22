package practicejsf.bean;

import javax.faces.bean.ManagedBean;

import practicejsf.bean.service.CustomerLookupService;
import practicejsf.bean.service.simple.CustomerSimpleMap;

@ManagedBean
public class BankingBeanAjax extends BankingBeanBase {

	private String message = "";
	private static final String SAMPLE_PASSWORD = "secret";

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	/**
	 * nullを返すのではなく戻り値の無いメソッドにすることでも
	 * 現在のページで結果を表示させることができる。
	 */
	public void showBalance() {
		String inputPassword = getPassword();
		if (SAMPLE_PASSWORD.equals(inputPassword)) {
			CustomerLookupService service = new CustomerSimpleMap();
			String customerId = getCustomerId();
			Customer customer = service.findCustomer(customerId);
			if (customer != null) {
				setCustomer(customer);
				message = String.format("%s %s の残高は \\%,.2f",
					customer.getFirstName(),
					customer.getLastName(),
					customer.getBalanceNoSign());
			} else {
				message = "不明なユーザーIDが入力されました。:" + customerId;
			}
		} else {
			message = "パスワード間違いです。";
		}
	}

}
