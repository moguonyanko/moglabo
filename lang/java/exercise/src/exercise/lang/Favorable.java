package exercise.lang;

public interface Favorable extends Amount {
	/**
	 * デフォルトメソッドでオーバーライドすることは可能。
	 * staticを指定することはできない。
	 * 内部でthisを参照することはできる。
	 * すなわちインスタンスフィールドを参照することはできる。
	 */
	@Override
	default int getAmount(){
		return 100;
	}
	
	default int getValue(){
		return 0;
	}
}
