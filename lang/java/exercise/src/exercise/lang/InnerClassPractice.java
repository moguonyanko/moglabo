package exercise.lang;

public class InnerClassPractice {

	private static final String SAMPLE_STRING = "static sample string";
	private final String sampleString = "sample string";
	
	public class Inner{
		
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
	 * default修飾子はインターフェースでしか使用できない。
	 */
//	default void test(){
//		
//	}
	
	public String getMyString(){
		return sampleString;
	}
	
}
