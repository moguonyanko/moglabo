package exercise.concurrent;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.ForkJoinTask;
import java.util.concurrent.RecursiveTask;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ForkJoinPractice {

	public static void main(String[] args) {

		int n = 40;
		FibFunc func;
		
		func = new NormalFibFunc(n);
		//func = new SubmitFibFunc(n);
		//func = new InvokeFibFunc(n);
		
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
	
	final int getSource(){
		return n;
	}
}

interface FibFunc{
	int calc();
}

abstract class CalcFibFunc implements FibFunc{
	
	final FibonacciTask task;

	public CalcFibFunc(int n) {
		this.task = new FibonacciTask(n);
	}
	
}

class SubmitFibFunc extends CalcFibFunc{

	public SubmitFibFunc(int n) {
		super(n);
	}

	@Override
	public int calc() {
		final ForkJoinPool joinPool = new ForkJoinPool();
		
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

class InvokeFibFunc extends CalcFibFunc{

	public InvokeFibFunc(int n) {
		super(n);
	}

	@Override
	public int calc() {
		/* thrown ClassCastException */
		//int result = task.compute();
		final ForkJoinPool joinPool = new ForkJoinPool();
		return joinPool.invoke(task);
	}
	
}

class NormalFibFunc extends CalcFibFunc{

	public NormalFibFunc(int n) {
		super(n);
	}
	
	private int getResult(int n){
		if(n <= 1){
			return n;
		}
		
		return getResult(n - 1) + getResult(n - 2);
	}

	@Override
	public int calc() {
		return getResult(task.getSource());
	}

}

