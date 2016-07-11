package practicejsf.bean;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;

@ManagedBean(name = "bankForm4")
@SessionScoped
public class DynamicLinkBankBean extends BankForm {

	@Override
	public void setCustomerId(String customerId) {
		super.setCustomerId(customerId);
		Customer customer = findCustomer(customerId);
		super.setCustomer(customer);
	}

	@Override
	public String findBalance() {
		String target = findUserBalance(false);
		
		String resultPage = target;
		
		if(target != null){
			resultPage = "show-dynamic-link-result?faces-redirect=true&amp;includeViewParams=true";
		}
		
		return resultPage;
	}
	
}
