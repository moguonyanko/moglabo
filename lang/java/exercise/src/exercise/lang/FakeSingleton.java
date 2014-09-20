package exercise.lang;

public class FakeSingleton extends Exception {

	public static final FakeSingleton INSTANCE = new FakeSingleton();
	
	private final String name = "Singleton";

	private FakeSingleton() {
		/* Does nothing. */
	}

	@Override
	public String toString() {
		return "I am singleton!";
	}

	public String getName() {
		return name;
	}
	
	private Object readResolve(){
		return INSTANCE;
	}
	
}
