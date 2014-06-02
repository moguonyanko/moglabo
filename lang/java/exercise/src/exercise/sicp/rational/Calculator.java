package exercise.sicp.rational;

import java.util.function.BiFunction;

public class Calculator<T extends Rational> {
	
	private final BiFunction<Integer, Integer, T> makeRat;

	public Calculator(BiFunction<Integer, Integer, T> maker) {
		makeRat = maker;
	}
	
	public T addRat(T x, T y){
		int xn = x.numer();
		int xd = x.denom();
		int yn = y.numer();
		int yd = y.denom();
		
		int n = xn * yd + yn * xd;
		int d = xd * yd;
		
		return makeRat.apply(n, d);
	}
	
}
