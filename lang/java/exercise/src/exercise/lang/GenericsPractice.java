package exercise.lang;

import exercise.lang.Parent.Child;
import exercise.lang.Parent2.Child2;

public class GenericsPractice {

	public static void main(String[] args) {
		Child<String> c = new Parent().new Child<>(1);
		//Parent.Child<String> c = new Parent().new <Integer> Child<String>(1);
		c.setMyType("TEST");
		System.out.println(c.getMyType().getClass().getName());

		//Parent2<String> p2 = new Parent2<String>();
		Parent2 p2 = new Parent2<String>();
		Child2 c2 = p2.getChild(1000);
		c2.setMyType(new Parent());
		System.out.println(c2.getMyType().getClass().getName());
	}
}

class Parent {

	class Child<T2> {

		T2 myType;

		<T3> Child(T3 t) {
			System.out.println(t.getClass().getName());
			//this.myType = t;
		}

		void setMyType(T2 t) {
			this.myType = t;
		}

		T2 getMyType() {
			return myType;
		}
	}
}

class Parent2<T1> {
	
	T1 parantParam;

	public class Child2<T2> {

		private T2 myType;
		//private T3 myType;
		
		<T3> Child2(T3 t){
			//this.myType = t;
		}

		void setMyType(T2 t) {
			this.myType = t;
		}

		T2 getMyType() {
			return myType;
		}
	}

	Child2 getChild(T1 param) {
		Child2 c2 = this.new Child2<>(param);
		parantParam = param;
		
		System.out.println(parantParam.getClass().getName());
		
		return c2;
	}
}

/**
 * 参考:
 * JavaMagazine Vol.42
 */
class Parent3<T extends Runnable, String> {
	// 「String」が型変数として宣言されてしまっているので以下の代入文は
	// java.lang.StringではないStringを参照してしまう。その変数にStringの
	// リテラルを代入しようとしているためコンパイルエラーになる。
//	private static final String CODE = "SAMPLE";
}
