package exercise.concurrent;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ThreadLocalRandom;

public class BlockingQueuePractice {

	public static void main(String[] args) {
		int bound = 100;
		BlockingQueue<Integer> queue = new ArrayBlockingQueue(bound);

		for (int i = 0; i < bound * 10; i++) {
			new Thread(new BlockingProducer(queue)).start();
			new Thread(new BlockingConsumer(queue)).start();
		}

	}
}

class BlockingProducer implements Runnable {

	private final BlockingQueue<Integer> queue;

	public BlockingProducer(BlockingQueue<Integer> queue) {
		this.queue = queue;
	}

	boolean add(int i) {
		return queue.add(i);
	}

	@Override
	public void run() {
		int value = ThreadLocalRandom.current().nextInt(10);
		boolean wasAdded = add(value);
		System.out.println(Thread.currentThread().getName() + " ADD : " + wasAdded);
	}
}

class BlockingConsumer implements Runnable {

	private final BlockingQueue<Integer> queue;

	public BlockingConsumer(BlockingQueue<Integer> queue) {
		this.queue = queue;
	}

	Integer take() {
		Integer value = 0;
		try {
			value = queue.take();
		} catch (InterruptedException ex) {
			Thread.currentThread().interrupt();
		}
		return Integer.valueOf(value);
	}

	@Override
	public void run() {
		Integer resultValue = take();
		System.out.println(Thread.currentThread().getName() + " REMOVE : " + resultValue);
	}
}