package exercise.function;

public class FuncTools {

	public static int fib(int n) {
		if (n <= 1) {
			return 1;
		} else {
			int a = FuncTools.fib(n - 1);
			int b = FuncTools.fib(n - 2);
			
			return a + b;
		}
	}

}
