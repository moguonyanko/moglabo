package practicejsf.bean;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.RequestScoped;

@ManagedBean(name = "helloWorld", eager = true)
@RequestScoped
public class HelloWorld {

	public HelloWorld() {
		System.out.println("HelloWorld はじまります！");
	}
	
	public String getMessage(){
		return "Hello World!";
	}
	
}
