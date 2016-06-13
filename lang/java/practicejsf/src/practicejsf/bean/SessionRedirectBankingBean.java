package practicejsf.bean;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;

/**
 * スーパークラスのBeanがSerializableなのでこのBeanはSerializableを
 * 指定しなくてもアプリケーションサーバ終了時にセッションに保存できる。
 */
@ManagedBean(name = "bankingBean3")
@SessionScoped
public class SessionRedirectBankingBean extends SessionBankingBean {
	
	private static final long serialVersionUID = 889873374561L;

	@Override
	public String showBalance() {
		return super.showBalance() + "-redirect?faces-redirect=true";
	}
	
}
