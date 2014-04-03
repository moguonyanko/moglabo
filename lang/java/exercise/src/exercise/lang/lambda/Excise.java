package exercise.lang.lambda;

public class Excise implements Tax {

	private static final double rate = 0.08;

	@Override
	public double getRate(){
		return rate;
	}
	
}
