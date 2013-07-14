package exercise.concurrent;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.Semaphore;
import java.util.concurrent.ThreadLocalRandom;
import java.util.logging.Level;
import java.util.logging.Logger;

public class SemaphorePractice {

	public static void main(String[] args) {

		int bound = 100;

		BoundedArrayList<Integer> list = new BoundedArrayList<>(bound);

		for (int i = 0; i < bound + 100; i++) {
			//try {
				Runnable adder = new BoundedListAdder(list);
				Thread adderThread = new Thread(adder);
				adderThread.start();
			//} catch (IllegalStateException ex) {
				Runnable remover = new BoundedListRemover(list);
				Thread removerThread = new Thread(remover);
				removerThread.start();
			//}
		}

	}
}

class CollectionFailException extends Exception {
}

class BoundedArrayList<T> {

	private final List<T> list;
	private final Semaphore semaphore;

	public BoundedArrayList(int bound) {
		list = Collections.synchronizedList(new ArrayList<T>());
		semaphore = new Semaphore(bound);
	}

	public boolean add(T o) throws InterruptedException {
		semaphore.acquire();

		boolean wasAdded = false;

		try {
			wasAdded = list.add(o);
		} finally {
			if (!wasAdded) {
				semaphore.release();
				throw new IllegalStateException();
			}
		}
		return wasAdded;
	}

	public boolean remove(T o) {
		boolean wasRemoved = list.remove(o);

		if (wasRemoved) {
			semaphore.release();
		}

		return wasRemoved;
	}
}

class BoundedListAdder implements Runnable {

	private final BoundedArrayList<Integer> list;

	public BoundedListAdder(BoundedArrayList<Integer> list) {
		this.list = list;
	}

	@Override
	public void run() {
		int num = ThreadLocalRandom.current().nextInt(10);

		boolean wasAdded = false;
		try {
			wasAdded = list.add(num);
		} catch (InterruptedException ex) {
			Logger.getLogger(BoundedListAdder.class.getName()).log(Level.SEVERE, null, ex);
		} finally {
			System.out.println("ADD : " + wasAdded);
		}
	}
}

class BoundedListRemover implements Runnable {

	private final BoundedArrayList<Integer> list;

	public BoundedListRemover(BoundedArrayList<Integer> list) {
		this.list = list;
	}

	@Override
	public void run() {
		int num = ThreadLocalRandom.current().nextInt(10);
		boolean wasRemmoved = list.remove(num);
		System.out.println("ROMOVE : " + wasRemmoved);
	}
}