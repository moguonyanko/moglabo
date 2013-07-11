package exercise.concurrent;

import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

public class CopyOnWritePractice {

	public static void main(String[] args) {
		List<String> list = new CopyOnWriteArrayList<>();
		//List<String> list = new Vector<>();
		//List<String> list = new ArrayList<>();

		list.add("Usao");
		list.add("Monchi");
		list.add("Goro");

		ListPrinter p = new ListPrinter(list);
		ListModificator m = new ListModificator(list);

		new Thread(p).start();
		new Thread(m).start();

	}
}

class ListPrinter implements Runnable {

	private final List<String> list;

	public ListPrinter(List<String> list) {
		this.list = list;
	}

	@Override
	public void run() {
		for (String value : list) {
			System.out.println(value);
		}
	}
}

class ListModificator implements Runnable {

	private final List<String> list;

	public ListModificator(List<String> list) {
		this.list = list;
	}

	@Override
	public void run() {
		list.add("NEKONEKONEKO");
	}
}
