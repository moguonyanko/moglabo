package test.exercise.lang;

import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.util.Optional;
import java.util.function.Function;
import java.util.function.Predicate;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

public class TestNull {
	private void m1 (Predicate<String> f1) {
		/* Does nothing. */
	}
	
	private void m1 (Function<String, Boolean> f1) {
		/* Does nothing. */
	}
	
	/* 将来のリリースではジェネリックスを指定できるようになるかも。 */
//	private enum Id<T> {
//		NAME<String>,
//		AGE<Integer>,
//		NOTE<Set<String>> {
//			String getNotes(String delimiter) {
//				String result = 
//					notes.stream().collect(Collectors.joining(delimiter));
//				return result;
//			}
//		};
//		
//		private final Set<String> notes;
//
//		private ID() {
//			this.notes = new HashSet<>();
//		}
//	}
	
	private enum Sample {
		A,
		B,
		C {
			void foo(){
				/* Does nothing. */
			}
		}
	}
	
	private <T> String getType(T t) throws NoSuchMethodException {
		Class[] pTypes = new Class[1];
		/**
		 * 以下のコードは無効。
		 * getTypeを示すMethodオブジェクトを得ることができないので
		 * NoSuchMethodExceptionが送出される。
		 * pTypes[0] = String.class;
		 * と書いてもgetTypeを見つけることができない。
		 */
        //pTypes[0] = T.class;
		Method m = this.getClass().getMethod("getType", pTypes);
		Parameter[] ps = m.getParameters();
		return ps[0].getType().getName();
	}
	
	@Test
	public void nullが設定された変数の型を調査する() {
		String s = null;
		
		/* 以下のコードは将来のリリースでは有効になるかもしれない。 */
		//m1(s -> s.isEmpty());
		
		/* SAMPLEに抽象メソッドで定義されていないメソッドは参照できない。 */
		//Sample.C.foo();
		/* 将来のリリースでは有効になるかもしれない。 */
		//var note = Id.NOTE;
		//note.getNotes(",");
		
		if (!(s instanceof String)) { /* nullなので当然false */
			String expected = "String";
			
			String actual = Optional.ofNullable(s).orElseGet(() -> {
				try {
					return getType(s);
				} catch (NoSuchMethodException ex) {
					throw new IllegalStateException(ex);
				}
			});
			
			assertThat(actual, is(expected));
		} else {
			fail("null設定忘れ");
		}
	}
	
}
