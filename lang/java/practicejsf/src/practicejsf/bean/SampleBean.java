package practicejsf.bean;

import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.ApplicationScoped;

@ManagedBean
@ApplicationScoped
public class SampleBean {

	private final LocalDateTime creationTime = LocalDateTime.now();
	private final String greeting = "こんにちは";

	public LocalDateTime getCreationTime() {
		return creationTime;
	}

	public String getGreeting() {
		return greeting;
	}

	public double getRandomNumber() {
		return ThreadLocalRandom.current().nextDouble();
	}

}
