package exercise.lang;

public class StringEqualityPractice {

	public static void main(String[] args) {
		
		String hoge1 = "hoge";
		
		String hoge2 = "hoge";
		String hoge3 = hoge1;
		
		String hoge4 = new String("hoge");

		StringBuilder hoge5 = new StringBuilder("hoge");

		System.out.println("hoge1 == hoge2 : " + (hoge1 == hoge2));
		System.out.println("hoge1.equals(hoge2) : " + hoge1.equals(hoge2));
		
		System.out.println("hoge1 == hoge3 : " + (hoge1 == hoge3));
		System.out.println("hoge1.equals(hoge3) : " + hoge1.equals(hoge3));
		
		System.out.println("hoge1 == hoge1.intern() : " + (hoge1 == hoge1.intern()));
		System.out.println("hoge1.equals(hoge1.intern()) : " + hoge1.equals(hoge1.intern()));
		
		System.out.println("hoge1 == hoge2.intern() : " + (hoge1 == hoge2.intern()));
		System.out.println("hoge1.equals(hoge2.intern()) : " + hoge1.equals(hoge2.intern()));
		
		System.out.println("hoge1 == hoge4 : " + (hoge1 == hoge4));
		System.out.println("hoge1.equals(hoge4) : " + hoge1.equals(hoge4));
		System.out.println("hoge1 == hoge4.intern() : " + (hoge1 == hoge4.intern()));
		System.out.println("hoge1.equals(hoge4.intern()) : " + hoge1.equals(hoge4.intern()));
		
		System.out.println("new StringBuilder(hoge1) == hoge5 : " + (new StringBuilder(hoge1) == hoge5));
		System.out.println("new StringBuilder(hoge1).equals(hoge5) : " + new StringBuilder(hoge1).equals(hoge5));
	}
}
