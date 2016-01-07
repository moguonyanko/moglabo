package exercise.concurrent;

import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RecursiveTask;

public class ForkGcd extends RecursiveTask<Integer> {

	private final int a;
	private final int b;

	public ForkGcd(int a, int b) {
		this.a = a;
		this.b = b;
	}

	/**
	 * thisをforkしたりjoinしたりするとStackOverFlowが発生する。
	 * forkおよびjoinしていないのでパフォーマンス的には効果の無い処理に
	 * なっている可能性がある。
	 */
	@Override
	protected Integer compute() {
		if (b == 0) {
			return a;
		} else {
			int mod = Math.abs(a) % Math.abs(b);
			ForkGcd task = new ForkGcd(b, mod);
			return task.invoke();
		}
	}
	
	public static int calc(int a, int b){
		ForkGcd gcd = new ForkGcd(a, b);
		/**
		 * ForkJoinPoolのコンストラクタに引数を渡さない場合は
		 * 動作環境のプロセッサの数を元に並列性レベルが決定される。
		 */
		ForkJoinPool pool = new ForkJoinPool();
		
		return pool.invoke(gcd);
	}
}
