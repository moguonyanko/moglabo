package practicejsf.bean;

import javax.faces.bean.ManagedBean;

@ManagedBean
public class BankingBeanSlow extends BankingBeanAjax {

	@Override
	public void showBalance() {
		try {
			Thread.sleep(5000);
		} catch (InterruptedException ex) {

		}

		super.showBalance();
	}

}
