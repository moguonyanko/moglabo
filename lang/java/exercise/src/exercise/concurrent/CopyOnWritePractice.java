package exercise.concurrent;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class CopyOnWritePractice {

	public static void main(String[] args) {
		CopyOnWriteArrayList<Employee> list = new CopyOnWriteArrayList<>();
	}
}

class Employee {

	private final Integer id;

	public Employee(Integer id) {
		this.id = id;
	}
}

class CheckerA implements Runnable{

	private final List<Employee> list;
	private int count;

	public CheckerA(List<Employee> list) {
		this.list = list;
	}
	
	@Override
	public void run() {
		list.add(new Employee(count++));
	}
	
}

class CheckerB implements Runnable{

	@Override
	public void run() {
	}
	
}