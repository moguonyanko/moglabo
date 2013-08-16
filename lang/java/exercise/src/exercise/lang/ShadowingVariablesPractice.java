package exercise.lang;

public class ShadowingVariablesPractice {

	public static void main(String[] args) {
		
		ParentAPI api0 = new ParentAPI();
		ParentAPI api1 = new MyExtendAPI();
		
		api0.displayFieldValue();
		api1.displayFieldValue();
		api0.displayLocalValue();
		api1.displayLocalValue();
		
	}
}


class ParentAPI {
	
    protected int value = 5;

    public void displayFieldValue() {
    	System.out.println(this.value);
    }
	
    public void displayLocalValue() {
    	int value = 10;
    	System.out.println(value);
    }
	
}

class MyExtendAPI extends ParentAPI{
	
	@Override
	public void displayLocalValue(){
		
		/**
		 * スーパークラスのフィールド名とサブクラスのメソッドの
		 * ローカル変数名が衝突することをサブクラスでは予期することができない。
		 * シャドウイングをコンパイルエラーにするならば，
		 * スーパークラスのフィールドに変更が入った時点で
		 * サブクラスの再コンパイルを強制する必要がある。
		 * （勿論これはシャドウイングを肯定する理由にはならない。）
		 */
		
    	int value = 1000;
    	System.out.println(value);
	}
	
}
