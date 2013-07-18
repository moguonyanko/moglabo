package exercise.concurrent;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.FutureTask;
import java.util.logging.Level;
import java.util.logging.Logger;

public class CallablePractice {

	public static void main(String[] args) {
		int num = 100;
		int threadNum = 1000;

		Callable<Integer> callable = new SampleCaller(num);
		FutureTask<Integer> future = new FutureTask(callable);
		ExecutorService executorService = Executors.newFixedThreadPool(threadNum);
		//ExecutorService executorService = Executors.newSingleThreadExecutor();

		Runnable runnable = new SampleRunner(num);

		Callable fromRunner = Executors.callable(runnable, SampleRunner.class);

		try {
			executorService.submit(callable);
			executorService.submit(fromRunner);
			executorService.execute(runnable);
			int result = future.get();
			System.out.println(result);
		} catch (InterruptedException | ExecutionException ex) {
			Logger.getLogger(CallablePractice.class.getName()).log(Level.SEVERE, null, ex);
		} finally {
			executorService.shutdown();
		}

	}
}

class VoidCaller implements Callable<Void> {

	@Override
	public Void call() throws Exception {

		return null;
	}
}

class SampleRunner implements Runnable {

	private final int num;

	public SampleRunner(int num) {
		this.num = num;
	}

	@Override
	public void run() {
		System.out.println("I have [" + num + "] number.");
	}
}

class SampleCaller implements Callable<Integer> {

	private final int num;

	public SampleCaller(int num) {
		this.num = num;
	}

	@Override
	public Integer call() throws Exception {
		return num * num;
	}
}
