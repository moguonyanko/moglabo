package practicejsf.bean;

import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

@Named
@RequestScoped
public class SecureBean {

	private String userName;
	private String password;

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	/**
	 * @todo
	 * ここで認証情報の確認を行ってはweb.xmlに指定したセキュリティ設定の意味が無いと思われる。
	 */
	public String register() {
		if ("testuser".equals(userName) && "testpassword".equals(password)) {
			return "success";
		} else {
			return "error";
		}
	}

}
