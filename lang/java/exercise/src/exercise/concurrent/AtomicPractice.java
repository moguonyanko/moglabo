package exercise.concurrent;

import java.util.concurrent.atomic.AtomicInteger;

public class AtomicPractice {

	public static void main(String[] args) {
		CountMachine machine = new CountMachine();

		int threadNum = 10;

		for (int i = 0; i < threadNum; i++) {
			Runnable updater = new CountUpdater(machine);
			Runnable reader = new CountReader(machine);
			Thread writeThread = new Thread(updater);
			Thread readThread = new Thread(reader);
			writeThread.start();
			readThread.start();
		}
	}
}

class CountMachine {

//	private int count;
	private AtomicInteger count = new AtomicInteger();
	private final byte[] mutex = new byte[0];

	void incCount() {
		synchronized (mutex) {
			//count++;
			count.incrementAndGet();
			//System.out.println(count.incrementAndGet());
		}
	}

	public int getCount() {
		synchronized (mutex) {
			return count.get();
		}
	}
}

class CountUpdater implements Runnable {

	private final CountMachine at;

	public CountUpdater(CountMachine at) {
		this.at = at;
	}

	@Override
	public void run() {
		this.at.incCount();
	}
}

class CountReader implements Runnable {

	private final CountMachine at;

	public CountReader(CountMachine at) {
		this.at = at;
	}

	@Override
	public void run() {
		System.out.println("Read : " + at.getCount());
	}
}