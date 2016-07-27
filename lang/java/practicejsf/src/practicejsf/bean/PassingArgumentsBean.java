package practicejsf.bean;

import java.util.concurrent.ThreadLocalRandom;

import javax.faces.bean.ApplicationScoped;
import javax.faces.bean.ManagedBean;

@ManagedBean(name = "testbean2")
@ApplicationScoped
public class PassingArgumentsBean {
	
	private static final String HELLO_ENGLISH = "Hello";
	private static final String HELLO_JAPANESE = "こんにちは";
	
	public String greeting(boolean useJapanese) {
		return useJapanese ? HELLO_JAPANESE : HELLO_ENGLISH;
	}
	
	public String greeting() {
		return greeting(false);
	}
	
	public double randomNumber(int range) {
		return ThreadLocalRandom.current().nextDouble(range);
	}
	
}
