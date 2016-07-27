package practicejsf.bean.type;

import practicejsf.bean.AlwaysSuccessPerson;
import practicejsf.bean.Person;

public class WriteinBallot {

	private final Person president;
	private final Person vicePresident;

	private boolean forProp1 = true;
	private boolean forProp2 = true;

	private final String prop1Description;
	private final String prop2Description;

	public WriteinBallot(String prop1Description, String prop2Description) {
		this.president = new AlwaysSuccessPerson("Usao", "Pococo", "usao@sonohen.org");
		this.vicePresident = new AlwaysSuccessPerson("Hoge", "Foobarbaz", "hogehoge@myhome.com");
		this.prop1Description = prop1Description;
		this.prop2Description = prop2Description;
	}

	public Person getPresident() {
		return president;
	}

	public Person getVicePresident() {
		return vicePresident;
	}

	public boolean isForProp1() {
		return forProp1;
	}

	public boolean isForProp2() {
		return forProp2;
	}

	public void setForProp1(boolean forProp1) {
		this.forProp1 = forProp1;
	}

	public void setForProp2(boolean forProp2) {
		this.forProp2 = forProp2;
	}

	public String getProp1Description() {
		return prop1Description;
	}

	public String getProp2Description() {
		return prop2Description;
	}

}
