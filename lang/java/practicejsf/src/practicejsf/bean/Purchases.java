package practicejsf.bean;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import javax.faces.bean.ManagedBean;

import practicejsf.bean.service.simple.PurchasesLogic;
import practicejsf.util.Faces;

@ManagedBean
public class Purchases {

	public enum Price {
		LOW, MEDIUM, HIGH;

		@Override
		public String toString() {
			return name().toLowerCase();
		}
	}

	private final String[] cheapItems;

	private final List<String> mediumItems;

	private final Map<Price, String> valuableItems;

	private boolean isEverythingOK = true;

	private Purchases(byte[] forInitializeSampleItems) {
		cheapItems = new String[]{
			"ガム", "ヨーヨー", "えんぴつ"
		};

		mediumItems = Arrays.asList(
			"バーチャルボーイ", "ワンダースワン", "ゲームギア"
		);
		
		valuableItems = Faces.toMap(
			Price.values(), 
			new String[]{"ポインター", "ラピッドパンダ", "JSFトレーニングコース"}
		);
	}

	public Purchases() {
		this(null);
	}

	public String[] getCheapItems() {
		return cheapItems;
	}

	public List<String> getMediumItems() {
		return mediumItems;
	}

	public Map<Price, String> getValuableItems() {
		return valuableItems;
	}

	public String purchaseItem() {
		isEverythingOK = PurchasesLogic.doBusinessLogic(this)
			&& PurchasesLogic.doDataAccessLogic(this);

		if (isEverythingOK) {
			return "purchase-success";
		} else {
			return "purchase-failure";
		}
	}
	
	public Price getLow(){
		return Price.LOW;
	}

	public Price getMedium(){
		return Price.MEDIUM;
	}

	public Price getHigh(){
		return Price.HIGH;
	}

}
