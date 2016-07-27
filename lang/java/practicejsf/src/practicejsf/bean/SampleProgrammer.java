package practicejsf.bean;

import java.util.Arrays;

import javax.faces.bean.ManagedBean;

@ManagedBean(name = "programmer1")
public class SampleProgrammer extends Programmer {

	public SampleProgrammer() {
		super("Ponko", "Popos", Programmer.Level.JUNIOR, 1000,
			Arrays.asList("Java", "JavaScript", "Python"));
	}

}
