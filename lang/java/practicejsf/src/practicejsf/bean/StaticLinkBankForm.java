package practicejsf.bean;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;

@ManagedBean(name = "bankForm3")
@SessionScoped
public class StaticLinkBankForm extends BankForm {

	@Override
	public String findBalance() {
		String target = findUserBalance(false);
		
		String resultPage = target;
		
		if(target != null){
			/**
			 * includeViewParams=falseとすると，このBeanのプロパティに関連付けられた
			 * f:viewParamの値はリダイレクトされた時に無視される。
			 */
			resultPage = "show-static-link-result?faces-redirect=true&amp;includeViewParams=true";
		}
		
		return resultPage;
	}
	
}
