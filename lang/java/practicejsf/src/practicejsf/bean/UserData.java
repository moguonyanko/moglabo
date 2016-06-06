package practicejsf.bean;

import java.util.Date;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.ManagedProperty;
import javax.faces.bean.RequestScoped;
import javax.faces.context.FacesContext;
import javax.faces.application.FacesMessage;

import practicejsf.util.Faces;

/**
 * SessionScopedを指定する場合，このクラスをシリアライズ可能にしておかないと
 * アプリケーションサーバのログに警告が出力される。
 */
@ManagedBean(name = "userData", eager = true)
@RequestScoped
public class UserData {

	/**
	 * ManagedPropertyはString型でなければならない。
	 */
	@ManagedProperty(value = "no name")
	private String name;
	
	@ManagedProperty(value = "")
	private String password;
	
	private static final String SUCCESS_USERNAME = "testuser";
	private static final String SUCCESS_PASSWORD = "testpassword";

	private final Date createTime = new Date();
	private final String message = "Hello world!";
	
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

	/**
	 * HTML要素のID属性を指定しなければFacesMessageは送れないのだろうか。
	 * HTMLとの依存性が高くなってしまうので他の方法があればそちらを採用したい。
	 */
	public String login() {
		FacesContext context = FacesContext.getCurrentInstance();
		String msgElementId = "auth:userInfo";
		/* 空文字を返せば現在のページを再表示できる。 */
		String currentPage = "";
		if(Faces.isNullOrEmpty(name)){
			FacesMessage msg = new FacesMessage(FacesMessage.SEVERITY_WARN, 
				"Empty user name", "ユーザー名を入力して下さい。");
			context.addMessage(msgElementId, msg);
			return currentPage;
		}
		if(Faces.isNullOrEmpty(password)){
			FacesMessage msg = new FacesMessage(FacesMessage.SEVERITY_WARN, 
				"Empty user password", "パスワードを入力して下さい。");
			context.addMessage(msgElementId, msg);
			return currentPage;
		}
		
		if (isSuccess()) {
			return "helloworld";
		} else {
			return "authfailed";
		}
	}

	/**
	 * userData.nonameというコードに対しこのメソッドが呼び出される。
	 */
	public boolean isNoname() {
		return name != null && !name.isEmpty();
	}

	public Date getCreateTime() {
		return createTime;
	}

	public String getMessage() {
		return message;
	}
	
}
