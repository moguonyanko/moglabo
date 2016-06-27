package practicejsf.bean;

import javax.faces.bean.ManagedBean;

@ManagedBean(name = "bidBean1")
public class BidBean {

	private String userId;
	private String keyword;
	private double bidAmount;
	private int bidDuration;

	public BidBean() {
		this.userId = "(no name)";
		this.keyword = "keyword";
	}
	
	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(String keyword) {
		this.keyword = keyword.trim();
	}

	public double getBidAmount() {
		return bidAmount;
	}

	private void parseBidAmount(String bidAmount) {
		try {
			double amount = Double.parseDouble(bidAmount);
			this.bidAmount = amount;
		} catch (NumberFormatException ex) {
			System.err.println("bidAmouontに浮動小数点数以外が入力されました。:" + bidAmount);
		}
	}
	
	public void setBidAmount(double bidAmount) {
		parseBidAmount(String.valueOf(bidAmount));
	}

	public int getBidDuration() {
		return bidDuration;
	}

	private void parseBidDuration(String bidDuration) {
		try {
			int duration = Integer.parseInt(bidDuration);
			this.bidDuration = duration;
		} catch (NumberFormatException ex) {
			System.err.println("bidDurationに整数以外が入力されました。:" + bidDuration);
		}
	}

	/**
	 * 引数をフィールドと同じint型ではなくString型にしてしまうと
	 * Faceletsページからフィールドの書き込みメソッドを呼び出すことができない。
	 * 
	 * int型として不適切な値が入力されるとこのメソッドが呼び出される前に
	 * JSFのライブラリ側で弾かれてFaceletsページに警告が表示される。
	 * すなわちparseBidDurationのバリデーションが利用されることは無い。
	 */
	public void setBidDuration(int bidDuration) {
		parseBidDuration(String.valueOf(bidDuration));
	}
	
	private void doSomeBusinessLogicWithBid() {
		/**
		 * 実際はここでフィールドを使った仕事を何か行う。
		 */
	}
	
	public String doBid() {
		doSomeBusinessLogicWithBid();
		return "show-bid";
	}

}
