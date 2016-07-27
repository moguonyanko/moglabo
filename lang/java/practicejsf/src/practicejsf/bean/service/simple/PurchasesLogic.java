package practicejsf.bean.service.simple;

import practicejsf.bean.Purchases;

public class PurchasesLogic {
	
	public static boolean doBusinessLogic(Purchases purchases) {
		/**
		 * 実際にはここにビジネスロジックにあたるコードを記述する。
		 */
		return Math.random() > 0.1;
	}
	
	public static boolean doDataAccessLogic(Purchases purchases) {
		/**
		 * 実際にはここにデータベースへのアクセス等を行うコードを記述する。
		 */
		return Math.random() > 0.1;
	}
	
}
