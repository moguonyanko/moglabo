package practicejsf.bean;

import javax.inject.Named;

@Named
public class CustomerBean {
	
	public String view(){
		return "view-customer";
	}
	
	public String delete() {
		System.out.println("これは保護されたメソッドです。");
		return "delete-customer";
	}
	
}
