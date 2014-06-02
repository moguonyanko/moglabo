package exercise.sicp.rational;

@FunctionalInterface
public interface MakeRat {
	Rational call(int n, int d);
}
