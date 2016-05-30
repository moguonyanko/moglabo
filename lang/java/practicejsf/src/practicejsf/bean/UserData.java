package practicejsf.bean;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.RequestScoped;

/**
 * SessionScopedを指定する場合，このクラスをシリアライズ可能にしておかないと
 * アプリケーションサーバのログに警告が出力される。
 */
@ManagedBean(name = "userData", eager = true)
@RequestScoped
public class UserData {

	private String name;
	private String password;

	private static final String SUCCESS_USERNAME = "testuser";
	private static final String SUCCESS_PASSWORD = "testpassword";

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	private boolean isSuccess() {
		return SUCCESS_USERNAME.equals(name)
			&& SUCCESS_PASSWORD.equals(password);
	}

	public String login() {
		if (isSuccess()) {
			return "helloworld";
		} else {
			return "authfailed";
		}
	}

}
