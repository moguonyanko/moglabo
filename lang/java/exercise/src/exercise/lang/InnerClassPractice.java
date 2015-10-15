package exercise.lang;

public class InnerClassPractice {

	private static final String SAMPLE_STRING = "static sample string";
	private final String sampleString = "sample string";
	
	public class Inner{
		
		private final int id;

		public Inner() {
			this.id = 0;
		}
		
		public Inner(int id) {
			this.id = id;
		}
		
		public String getSampleString(){
			return sampleString + " from Inner";
		}
		
	}
	
	public static class InnerStatic{
		
		public String getSampleString(){
			return SAMPLE_STRING + " from InnerStatic";
		}
		
	}
	
	/**
	 * 同じインターフェースを実装したい内部クラスが複数存在する時，
	 * 内部インターフェースは有用かもしれない。
	 * 内部インターフェースはprivateにすることができる。
	 * 当然privateにするとクラス外からそのインターフェースの型を
	 * 参照することはできなくなる。
	 */
	private interface InnerComparable extends Comparable<InnerComparable>{
		
		/**
		 * privateな内部インターフェースのメソッドであっても
		 * privateを指定することはできない。
		 */
		int getInnerId();
		
		/**
		 * Objectクラスのメソッドでなければdefault修飾子を指定して
		 * オーバーライドすることは可能。
		 */
		@Override
		default int compareTo(InnerComparable other){
			return this.getInnerId() - other.getInnerId();
		}
		
	};
	
	public class InnerComparableClass implements InnerComparable {
		
		private final Inner inner;

		public InnerComparableClass(Inner inner) {
			this.inner = inner;
		}
		
		@Override
		public int getInnerId(){
			InnerComparable dummy = new InnerComparable() {

				@Override
				public int getInnerId() {
					return -1000;
				}

				@Override
				public int compareTo(InnerComparable o) {
					return 0;
				}

				@Override
				public String toString() {
					return "Access private interface : " + InnerComparable.class.getCanonicalName();
				}
				
			};
			
			System.out.println(dummy);
			
			return inner.id;
		}
		
//		@Override
//		public int compareTo(InnerComparable other){
//			return this.getInnerId() - other.getInnerId();
//		}

		@Override
		public String toString() {
			return "My Inner id is " + getInnerId();
		}
		
	}
	
	/**
	 * default修飾子はインターフェースでしか使用できない。
	 */
//	default void test(){
//		
//	}
	
	public String getMyString(){
		return sampleString;
	}
	
	public static String getModifiedString(String term){
		/**
		 * 以下はコンパイルエラー。インターフェースは本質的にstaticであるため。 
		 * ローカルクラスを内包するメソッドが静的メソッドでも不可。
		 */
//		interface Sample{
//			
//		}
		
		/**
		 * ローカルクラスは静的クラスにできない。
		 * 
		 * ローカルクラスが静的メソッド内に宣言された場合，
		 * ローカルクラスのメソッド内では静的メソッドを定義したクラスの
		 * インスタンスメンバを参照できない。
		 */
		class LocalModifier{
			private static final String KEYWORD = "*MODIFIED*";
			/* 静的変数の宣言はできない。 */
			//private static String staticName = "static";
			
			private int id;

			{
				id = 100;
			}

			public LocalModifier(int id) {
				this.id += id;
			}

			public String modify() {
				/* getModifiedStringが静的メソッドでなければ以下は有効。 */
				//return KEYWORD + term + id + "@" + sampleString + SAMPLE_STRING;
				return KEYWORD + term + id + "@" + SAMPLE_STRING;
			}
			
			/**
			 * ローカルクラス内に静的初期化子及び静的メンバは宣言できない。
			 */
			
//			static {
//				
//			}
				
//			public static void test(){
//				
//			}
			
			/**
			 * 以下も同様にコンパイルエラー。
			 */
//			interface Sample{
//				
//			}
			
		}
		
		LocalModifier modifier = new LocalModifier(400);
		
		return modifier.modify();
	}
	
}
