package exercise.lang;

public class BinaryLiteralPractice {

	public static void main(String[] args) {
		int eightbit = 0B00000000;

		byte b = (byte) eightbit;

		long a = 0B0_0_0_0L;

		long ll = 0b000000000000000000000000000000000000000L;

		int c = 0b00_______________00;

		short d = 0B11111111;

		byte e = (byte)0B11111111;
		byte f = 0B01111111;
		
		System.out.println(e);
		System.out.println(f);
				
		short g = 0B11111111;
		int h = 0B11111111;
		
		System.out.println(g);
		System.out.println(h);

		short i = (short)0B1111111111111111;
		int j = 0B1111111111111111;
		
		System.out.println(i);
		System.out.println(j);

		int k = 0B11111111111111111111111111111111;
		long l = 0B11111111111111111111111111111111L;
		
		System.out.println(k);
		System.out.println(l);
	}
}
