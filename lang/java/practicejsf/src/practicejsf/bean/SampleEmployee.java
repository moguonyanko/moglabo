package practicejsf.bean;

import java.util.Arrays;
import java.util.List;

import javax.faces.bean.ManagedBean;

import practicejsf.util.Faces;

@ManagedBean(name = "employee1")
public class SampleEmployee extends Employee {

	private static final List<Name> SAMPLE_NAMES = Arrays.asList(
		new Name("Nanashi", "Gonbei"),
		new Name("Paopao", "Rarihe"),
		new Name("Foobar", "Baz")
	);
	
	private static final Company SAMPLE_COMPANY = new Company("myhome.com", "Clean my house");
	
	public SampleEmployee() {
		super(Faces.getRandomElement(SAMPLE_NAMES), SAMPLE_COMPANY);
	}
	
}
