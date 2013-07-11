package exercise.concurrent;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;

public class ConcurrentMapPractice {

	public static void main(String[] args) {

		//Map<String, Integer> map = new Hashtable<>();
		//Map<String, Integer> map = new HashMap<>();
		Map<String, Integer> map = new ConcurrentHashMap<>();

		map.put("USAO", 100);
		map.put("MONCHI", 200);
		map.put("YOGORE", 300);

		MapPrinter printer = new MapPrinter(map);
		MapModificator modificator = new MapModificator(map);

		for (int i = 0; i < 5; i++) {
			new Thread(printer).start();
			new Thread(modificator).start();
		}
	}
}

class MapPrinter implements Runnable {

	private final Map<String, Integer> map;

	public MapPrinter(Map<String, Integer> map) {
		this.map = map;
	}

	@Override
	public void run() {
		for (String key : map.keySet()) {
			System.out.println(map.get(key) + ": size is " + map.size());
		}
	}
}

class MapModificator implements Runnable {

	private final Map<String, Integer> map;

	public MapModificator(Map<String, Integer> map) {
		this.map = map;
	}

	@Override
	public void run() {
		//map.put("POOPOO", new Random().nextInt(1000));
		map.put("NEKONEKONEKO", ThreadLocalRandom.current().nextInt(1000));
	}
}