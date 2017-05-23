package exercise.lang;

import java.util.ArrayList;
import java.util.List;

public class GenericMyContainer<E> implements MyContainer<E> {
	
	private final List<E> items = new ArrayList<>();

	@Override
	public void append(E item) {
		items.add(item);
	}

	@Override
	public int count() {
		return items.size();
	}

	@Override
	public E get(int i) {
		return items.get(i);
	}
	
}
