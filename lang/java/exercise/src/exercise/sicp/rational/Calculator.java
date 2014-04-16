package exercise.sicp.rational;

import java.util.function.Supplier;

public class Calculator {
	
	private final MakeRat makeRat;

	public Calculator() {
		makeRat = (int n, int d) -> new RationalNumber(n, d);
	}
	
	public <T extends Rational> Calculator(Supplier<T> s) {
		T result = s.get(); /* Is there multi arguments recieved Supplier? */
		makeRat = (int n, int d) -> new RationalNumber(n, d);
	}
	
	public Rational addRat(Rational x, Rational y){
		int xn = x.numer();
		int xd = x.denom();
		int yn = y.numer();
		int yd = y.denom();
		
		int n = xn * yd + yn * xd;
		int d = xd * yd;
		
		return makeRat.call(n, d);
	}
	
}
