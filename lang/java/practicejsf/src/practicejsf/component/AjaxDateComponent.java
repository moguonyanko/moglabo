package practicejsf.component;

import java.time.LocalDateTime;
import java.time.Month;
import java.time.Year;
import java.util.Date;
import java.util.stream.IntStream;

import javax.faces.component.FacesComponent;

import practicejsf.util.Faces;

@FacesComponent("practicejsf.component.DateComponent3")
public class AjaxDateComponent extends PeriodDateComponent {

	private enum Days {
		DAYS_28(28),
		DAYS_29(29),
		DAYS_30(30),
		DAYS_31(31);

		private final int length;
		private final int[] days;
		
		private static final String PREFIX = "DAYS_";

		private Days(int length) {
			this.length = length;
			this.days = IntStream.rangeClosed(1, length).toArray();
		}

		private static Days parse(int dayLength) {
			return Days.valueOf(PREFIX + String.valueOf(dayLength));
		}

		public int getLength() {
			return length;
		}
		
		public int[] getDays() {
			return days;
		}
	}

	@Override
	public int[] getDays() {
		Date date = (Date) getValue();

		LocalDateTime localDateTime = Faces.getLocalDateTimeByDate(date);
		Year year = Year.of(localDateTime.getYear());
		Month month = localDateTime.getMonth();

		/**
		 * @todo
		 * 現在の年がうるう年であるかどうかを判定し，うるう年なら2月が最大日数をを返すように
		 * maxLengthメソッドを，うるう年でなければ最小日数を返すようにminLengthメソッドを
		 * 呼び出している。しかし同じことを実現するもっと良い方法があるはずである。
		 */
		int dayLength = year.isLeap() ? month.maxLength() : month.minLength();
		Days days = Days.parse(dayLength);

		return days.getDays();
	}

}
