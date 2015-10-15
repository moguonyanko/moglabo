package exercise.lang;

public interface InnerInterfacePractice {

	static class StaticInnerClass {
		
		private final String name;

		public StaticInnerClass(String name) {
			this.name = name;
		}

		public String getName() {
			return name;
		}
		
	}
	
	/**
	 * インターフェース内のクラスは暗黙で静的内部クラスにされるので，
	 * 以下のクラス宣言は次と同義である。
	 * <pre>static class InnerClass</pre>
	 */
	class InnerClass{
		
		private final String name;

		public InnerClass(String name) {
			this.name = name;
		}

		public String getName() {
			return name;
		}
		
	}

}
