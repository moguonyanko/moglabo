package exercise.lang;

import java.util.*;

/**
 * reference:
 * Java 7 technotes
 * http://docs.oracle.com/javase/jp/7/technotes/guides/language/non-reifiable-varargs.html
 * 
 * @author moguonyanko
 */
public class GenericsHeapErrorPractice {

	/**
	 * @param args the command line arguments
	 */
	public static void main(String[] args) {

		//List nums = new ArrayList<Number>();
		//List<String> strs = nums;
		//nums.add(0, new Integer(42));
		//String s = strs.get(0);
		//System.out.println(s);

		List<String> stringListA = new ArrayList<>();
		List<String> stringListB = new ArrayList<>();

		ArrayBuilder.addToList(stringListA, "Usao", "Monchi", "Pini");
		ArrayBuilder.addToList(stringListA, "Moguo", "Poo", "Wan");
		List<List<String>> listOfStringLists = new ArrayList<>();
		
		/* Warning is not notice.  */
		ArrayBuilder.addToList(listOfStringLists, stringListA, stringListB);

		ArrayBuilder.faultyMethod(Arrays.asList("NyaNya!"), Arrays.asList("WanWan!"));

	}
}

class ArrayBuilder {

	/**
	 * @todo
	 * Warning is not notice "though Java7 used". 
	 * "@SafeVarargs" and "@SuppressWarnings({"unchecked", "varargs"})" 
	 * is not used.
	 * 
	 * @param <T>
	 * @param listArgs
	 * @param elements 
	 */
	public static <T> void addToList(List<T> listArgs, T... elements) {
		for(T x : elements){
			listArgs.add(x);
		}
		//listArgs.addAll(Arrays.asList(elements));
	}

	public static void faultyMethod(List<String>... lists) {
		Object[] objects = lists; /* Valid but unnormally */
		objects[0] = Arrays.asList(new Integer(42));
		String s = lists[0].get(0); /* ClassCastExceptions */
	}
}
