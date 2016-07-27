package practicejsf.bean;

import javax.enterprise.context.RequestScoped;
import javax.faces.context.Flash;
import javax.faces.event.ComponentSystemEvent;
import javax.inject.Named;

import practicejsf.util.Faces;

/**
 * ManagedBeanではなくNamedを使う場合，明示的にRequestScopedを指定しなければ
 * FaceletsページからBeanを参照できない。
 */
@Named
@RequestScoped
public class Member {
	
	private String firstName;
	private String lastName;
	
	private static final String FIRST_NAME_KEY = "firstName";
	private static final String LAST_NAME_KEY = "lastName";

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	
	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	
	public String goToConfirmView(){
		Flash flash = Faces.getFlash();
		flash.put(FIRST_NAME_KEY, firstName);
		flash.put(LAST_NAME_KEY, lastName);
		
		return Faces.redirect("confirm");
	}
	
	public String goToInputFormView(){
		return Faces.redirect("input");
	}
	
	public void pullValuesFromFlash(ComponentSystemEvent event){
		firstName = Faces.getValueFromFlash(FIRST_NAME_KEY);
		lastName = Faces.getValueFromFlash(LAST_NAME_KEY);
	}
	
	public String insertValue(){
		Flash flash = Faces.getFlash();
		
		/**
		 * Flash.setKeepMessagesにtrueを渡して呼び出さないと，FacesContextに
		 * addMessageしたメッセージが保持されずリダイレクト後のページで表示されない。
		 */
		flash.setKeepMessages(true);
		pullValuesFromFlash(null);
		
		System.out.println("入力された苗字は " + firstName + " です。");
		System.out.println("入力された名前は " + lastName + " です。");
		
		Faces.addMessage("値を挿入しました！");
		
		return Faces.redirect("done");
	}
	
}
