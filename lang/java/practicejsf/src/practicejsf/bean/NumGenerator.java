package practicejsf.bean;

import java.util.concurrent.ThreadLocalRandom;

import javax.faces.bean.ManagedBean;

@ManagedBean
public class NumGenerator {

	public double getRandomNum() {
		return ThreadLocalRandom.current().nextDouble();
	}

}
