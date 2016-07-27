package practicejsf.bean;

import java.util.concurrent.ThreadLocalRandom;

import javax.faces.bean.ManagedBean;

@ManagedBean
public class NumberGenerator {

	private double number = ThreadLocalRandom.current().nextDouble();
	private double range = 1.0;

	private static double getRandomNumber(double range) {
		return range * ThreadLocalRandom.current().nextDouble();
	}
	
	public double getNumber() {
		return number;
	}
	
	public double getNumberWithoutAction() {
		return getRandomNumber(range);
	}

	public Class<Void> randomize() {
		number = getRandomNumber(range);
		System.out.println("Updated random number:" + number);
		/**
		 * 文字列を返すとその名前のページを探しに行ってしまう。
		 * nullを返すと現在のページで結果を表示せよという意味になる。
		 * nullを返すならば戻り値の型はStringでも何でもいい。
		 * Ajaxを使わない場合，ページがリロードされる。
		 * 何かオブジェクトを返すとその文字列表現に基づいてページを
		 * 探しに行ってしまう。
		 */
		return null;
	}

	public double getRange() {
		return range;
	}

	public void setRange(double range) {
		this.range = range;
	}

}
