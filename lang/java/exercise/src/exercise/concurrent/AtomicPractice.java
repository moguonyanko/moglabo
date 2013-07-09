package exercise.concurrent;

import java.util.concurrent.atomic.AtomicInteger;

public class AtomicPractice {

	public static void main(String[] args) {
		CountMachine machine = new CountMachine();
		int loopNum = 10;
		int threadNum = 200;

		for (int i = 0; i < threadNum; i++) {
			Counter counter1 = new Counter(machine, loopNum);
			Thread t1 = new Thread(counter1);
			t1.start();
		}
	}
}

class CountMachine {

//	private int count;
	
	private AtomicInteger count = new AtomicInteger();
	
	private final byte[] mutex = new byte[0];

	void incCount() {
		synchronized(mutex){
			//count++;
			System.out.println(count.incrementAndGet());
		}
	}
}

class Counter implements Runnable {

	private final CountMachine at;
	private final int loopNum;

	public Counter(CountMachine at, int loopNum) {
		this.at = at;
		this.loopNum = loopNum;
	}

	@Override
	public void run() {
		for (int i = 0; i < loopNum; i++) {
			this.at.incCount();
		}
	}
}
