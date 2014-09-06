package exercise.function;

import java.util.function.Function;

public class Delay<T, R> {
	
	private R value;
	private final Function<T, R> function;

	public Delay(Function<T, R> function) {
		this.function = function;
	}
	
	public R force(T arg){
		if(value == null){
			value = function.apply(arg);
		}
		
		return value;
	}
	
}
