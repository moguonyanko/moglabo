package practicejsf.bean;

import javax.faces.bean.ManagedBean;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.validator.ValidatorException;

import practicejsf.util.Faces;

@ManagedBean(name = "reservationBean2")
public class ReservationRoomBean extends ReservationBean {

	private Integer roomNumber = 2;

	public Integer getRoomNumber() {
		return roomNumber;
	}

	public void setRoomNumber(Integer roomNumber) {
		this.roomNumber = roomNumber;
	}

	@Override
	public String register() {
		boolean registerSuccess = super.register() != null;

		if (registerSuccess) {
			return "show-dates-with-room";
		} else {
			return null;
		}
	}

	/**
	 * プロパティの型に変換できない値を入力された場合はh:inputText等のvalidator属性に指定した
	 * メソッドは呼び出されない。つまりInteger型に変換できない値がこのメソッドに渡されることは無く，
	 * 最初に行っている数値へのパースで失敗することはあり得ないということである。
	 * 浮動小数点数を入力された場合でもこのメソッドは呼び出されない。整数(Integer)でないとダメ。
	 */
	public void validateRoomNumber(FacesContext context, UIComponent component, Object value)
		throws ValidatorException {
		int roomNo;
		try {
			roomNo = Integer.parseInt(String.valueOf(value));
		} catch (NumberFormatException nfe) {
			String msg = "不正な部屋番号です。:" + value;
			throw new ValidatorException(Faces.createErrorMessage(msg));
		}

		if (roomNo != 2 && roomNo != 7) {
			String text = String.format("%s 番の部屋は現在利用できません。", roomNo);
			throw new ValidatorException(Faces.createErrorMessage(text));
		}
	}

}
