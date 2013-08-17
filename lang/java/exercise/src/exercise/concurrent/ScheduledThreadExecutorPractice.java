package exercise.concurrent;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ScheduledThreadExecutorPractice {

	public static void main(String[] args) {

		int delaySec = 2;
		long initDelay = 3;

		int[] nums = new int[]{1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
		Callable<Integer> task = new TotalIntTask(nums);

		ScheduledExecutorService caller =
			Executors.newSingleThreadScheduledExecutor();
		ScheduledFuture<Integer> callFuture =
			caller.schedule(task, delaySec, TimeUnit.SECONDS);

		Runnable runner = new Runnable() {
			@Override
			public void run() {
				System.out.println("test");
			}
		};
		ScheduledFuture<?> runFuture =
			caller.scheduleAtFixedRate(runner, initDelay, delaySec + 1, TimeUnit.SECONDS);
		//ScheduledFuture<?> runFuture =
		//	caller.scheduleWithFixedDelay(runner, initDelay, delaySec + 1, TimeUnit.SECONDS);
		//ScheduledFuture<?> runFuture =
		//	caller.schedule(runner, delaySec + 1, TimeUnit.SECONDS);

		Integer callerResult = null;
		Object runnerResult = null;

		try {
			int total = callFuture.get();
			callerResult = Integer.valueOf(total);
			runnerResult = runFuture.get();
			runnerResult = runFuture.cancel(true);
		} catch (InterruptedException | ExecutionException ex) {
			Logger.getLogger(ScheduledThreadExecutorPractice.class.getName()).log(Level.SEVERE, null, ex);
		}

		System.out.println(callerResult);
		System.out.println(runnerResult);

		caller.shutdown();
	}
}

class TotalIntTask implements Callable<Integer> {

	private final List<Integer> targets = new ArrayList<>();

	public TotalIntTask(int[] nums) {
		for (int n : nums) {
			targets.add(n);
		}
	}

	@Override
	public Integer call() throws Exception {
		int result = 0;

		for (Integer n : targets) {
			result += n;
		}

		return result;
	}
}
