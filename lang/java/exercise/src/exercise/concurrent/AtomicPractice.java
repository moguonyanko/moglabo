package exercise.concurrent;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class AtomicPractice {

	public static void main(String[] args) {
		CountMachine machine = new CountMachine();

		int threadNum = 10;

		for (int i = 0; i < threadNum; i++) {
			Runnable writer = new CountWriter(machine);
			Runnable reader = new CountReader(machine);
			Thread writeThread = new Thread(writer);
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
	private final ReadWriteLock lock = new ReentrantReadWriteLock();

	void incCount() {

		lock.writeLock().lock();
		try {
			count.incrementAndGet();
		} finally {
			lock.writeLock().unlock();
		}

		/*
		 synchronized (mutex) {
		 //count++;
		 count.incrementAndGet();
		 //System.out.println(count.incrementAndGet());
		 }
		 */
	}

	int getCount() {

		int value = 0;

		lock.readLock().lock();
		try {
			value = count.get();
		} finally {
			lock.readLock().unlock();
		}

		return value;

		/*
		 synchronized (mutex) {
		 return count.get();
		 }
		 */
	}
}


class CountWriter implements Runnable {

	private final CountMachine countMachine;

	public CountWriter(CountMachine countMachine) {
		this.countMachine = countMachine;
	}

	@Override
	public void run() {
		this.countMachine.incCount();
	}
}

class CountReader implements Runnable {

	private final CountMachine countMachine;

	public CountReader(CountMachine countMachine) {
		this.countMachine = countMachine;
	}

	@Override
	public void run() {
		System.out.println(Thread.currentThread().getName()
			+ " Read : " + countMachine.getCount());
	}
}