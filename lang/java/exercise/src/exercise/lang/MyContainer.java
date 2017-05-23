package exercise.lang;

public interface MyContainer<E> {
	void append(E item);
	int count();
	E get(int i);
}
