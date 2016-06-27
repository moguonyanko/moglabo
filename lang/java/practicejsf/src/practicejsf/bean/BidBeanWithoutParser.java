package practicejsf.bean;

import javax.faces.bean.ManagedBean;

@ManagedBean(name = "bidBean2")
public class BidBeanWithoutParser {

	private String userId;
	private String keyword;
	/**
	 * 基本データ型のdoubleやintを指定してしまうと入力が行われなかった時に
	 * 各データ型に応じた初期値がFaceletsページに表示されてしまう。
	 * このような初期値で操作を進めることは普通はユーザーが望むものではない。
	 * 従ってデフォルトでは空文字を返すようにするのが安全である。
	 * nullが初期値になるように型を選択すればFaceletsページでは空文字で表示される。
	 */
	private Double bidAmount;
	private Integer bidDuration;

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
		if (keyword != null) {
			this.keyword = keyword.trim();
		} else {
			this.keyword = "";
		}
	}

	public Double getBidAmount() {
		return bidAmount;
	}

	public void setBidAmount(Double bidAmount) {
		this.bidAmount = bidAmount;
	}

	public Integer getBidDuration() {
		return bidDuration;
	}

	public void setBidDuration(Integer bidDuration) {
		this.bidDuration = bidDuration;
	}

	private void doSomeBusinessLogicWithBid() {
		/**
		 * 実際はここでフィールドを使った仕事を何か行う。
		 */
	}

	public String doBid() {
		doSomeBusinessLogicWithBid();
		return "show-bid-without-parser";
	}

}
