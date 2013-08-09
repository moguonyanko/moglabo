package exercise.concurrent;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.ForkJoinTask;
import java.util.concurrent.RecursiveTask;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ForkJoinPractice {

	public static void main(String[] args) {

		System.out.println("available CPU:" + Runtime.getRuntime().availableProcessors());

		int n = 40;
		FibonacciTask task = new FibonacciTask(n);

		FibFunc func;
		int parallelism = 4;

		//func = new NormalFibFunc(task, parallelism);
		//func = new SubmitFibFunc(task, parallelism);
		func = new InvokeFibFunc(task, parallelism);

		long startTime = System.currentTimeMillis();

		int resultInvoke = func.calc();

		long endTime = System.currentTimeMillis();

		long executeTime = endTime - startTime;

		System.out.println("n = " + n);
		System.out.println("Fibonacci solution by invoke:" + resultInvoke);
		//System.out.println("Fibonacci solution by submit:" + resultSubmit);
		System.out.println("SpentTime:" + executeTime);
	}
}

class FibonacciTask extends RecursiveTask<Integer> {

	private final int n;

	public FibonacciTask(int n) {
		this.n = n;
	}

	@Override
	protected Integer compute() {

		if (n <= 1) {
			return n;
		}

		FibonacciTask task1 = new FibonacciTask(n - 1);
		task1.fork();

		FibonacciTask task2 = new FibonacciTask(n - 2);

		return task2.invoke() + task1.join();

	}

	final int getStart() {
		return n;
	}
}

interface FibFunc {

	int calc();
}

abstract class CalcFibFunc implements FibFunc {

	final FibonacciTask task;
	final int parallelism;

	public CalcFibFunc(FibonacciTask task, int parallelism) {
		this.task = task;

		if (parallelism <= 0) {
			parallelism = Runtime.getRuntime().availableProcessors();
		}

		this.parallelism = parallelism;
	}
}

class SubmitFibFunc extends CalcFibFunc {

	public SubmitFibFunc(FibonacciTask task, int parallelism) {
		super(task, parallelism);
	}

	@Override
	public int calc() {
		final ForkJoinPool joinPool = new ForkJoinPool(parallelism);

		ForkJoinTask<Integer> resultTask = joinPool.submit(task);

		int result = 0;

		try {
			result = resultTask.get();
		} catch (InterruptedException | ExecutionException ex) {
			Logger.getLogger(ForkJoinPractice.class.getName()).log(Level.SEVERE, null, ex);
		}

		return result;
	}
}

class InvokeFibFunc extends CalcFibFunc {

	public InvokeFibFunc(FibonacciTask task, int parallelism) {
		super(task, parallelism);
	}

	@Override
	public int calc() {
		/* thrown ClassCastException */
		//int result = task.compute();
		final ForkJoinPool joinPool = new ForkJoinPool(parallelism);
		return joinPool.invoke(task);
	}
}

class NormalFibFunc extends CalcFibFunc {

	public NormalFibFunc(FibonacciTask task, int parallelism) {
		super(task, parallelism);
	}

	private int getResult(int n) {
		if (n <= 1) {
			return n;
		}

		return getResult(n - 1) + getResult(n - 2);
	}

	@Override
	public int calc() {
		return getResult(task.getStart());
	}
}
