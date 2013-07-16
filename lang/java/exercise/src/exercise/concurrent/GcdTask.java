package exercise.concurrent;

import java.util.concurrent.RecursiveTask;

public class GcdTask extends RecursiveTask<Integer> {

	private final int a;
	private final int b;

	public GcdTask(int a, int b) {
		this.a = a;
		this.b = b;
	}

	@Override
	protected Integer compute() {
		if (b == 0) {
			return a;
		} else {
			int x = Math.abs(a) % Math.abs(b);
			GcdTask task = new GcdTask(b, x);
			int result = task.compute() + this.join();
			return result;
		}
	}
	
	public int calc(){
		return this.compute();
	}
}
