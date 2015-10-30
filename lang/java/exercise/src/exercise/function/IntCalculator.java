package exercise.function;

@FunctionalInterface
public interface IntCalculator extends Calculator<Integer, Integer, Integer>{

	/**
	 * 下のコードを書かなくてもスーパーインターフェースの型変数にIntegerを
	 * 渡しているので書いているのとほぼ同じ状態になる。
	 */
	//@Override
	//Integer calc(Integer t, Integer u);
	
	//int calc(int t, int u);
	
}
