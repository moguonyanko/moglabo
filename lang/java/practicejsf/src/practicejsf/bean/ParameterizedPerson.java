package practicejsf.bean;

import javax.faces.bean.ManagedBean;

@ManagedBean(name = "person2")
public class ParameterizedPerson extends Person {

	public ParameterizedPerson() {
		super("サンプル", "太郎", "sample@hoge.ne.jp");
	}

	@Override
	public String doRegistration() {
		return "registration-success";
	}
	
}
