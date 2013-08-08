package exercise.concurrent;

import java.util.concurrent.RecursiveTask;

public class ForkJoinPractice{
	
	public static void main(String[] args){
		
		int n = 10;
		Fibonacci task = new Fibonacci(n);
		int result = task.compute();
		
		System.out.println(result);
	}
	
}

class Fibonacci extends RecursiveTask<Integer>{
	
	
	private final int n;

	public Fibonacci(int n){
		this.n = n;
	}

	@Override
	protected Integer compute(){
		
		if (n <= 1){
			return n;
		}
		
		Fibonacci task1 = new Fibonacci(n - 1);
		task1.fork();
		
		Fibonacci task2 = new Fibonacci(n - 2);
		
		return task2.invoke() + task1.join();
		
	}
	
}
