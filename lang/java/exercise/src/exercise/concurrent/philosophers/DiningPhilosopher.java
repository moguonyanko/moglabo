package exercise.concurrent.philosophers;

import java.util.logging.Level;
import java.util.logging.Logger;

public class DiningPhilosopher implements Philosopher {

	private final String name;
	
	private Tableware leftWare;
	private Tableware rightWare;

	public DiningPhilosopher(String name) {
		this.name = name;
	}
	
	void takeWare(Tableware ware) {
		if (!ware.isInUse()) {
			leftWare = ware;
			ware.setInUse(true);
		} else if (!ware.isInUse()) {
			rightWare = ware;
			ware.setInUse(true);
		}
	}

	void eat() {
		System.out.println(name + "eat the dinner by " + leftWare + " and " + rightWare);
	}

	@Override
	public void think() {
		try {
			Thread.sleep(1000);
		} catch (InterruptedException ex) {
			Logger.getLogger(DiningPhilosopher.class.getName()).log(Level.SEVERE, null, ex);
		}
	}
}
