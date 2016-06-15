package practicejsf.bean;

import javax.faces.bean.ManagedBean;

import practicejsf.util.Faces;

@ManagedBean
public class SimpleController {

	private String message;

	public interface Outcome {

		String getOutcome();

	}

	public enum NormalOutcome implements Outcome {

		PAGE1, PAGE2, PAGE3;

		@Override
		public String getOutcome() {
			return name().toLowerCase();
		}

		@Override
		public String toString() {
			return getOutcome();
		}
	}

	public enum WrongOutcome implements Outcome {

		TOO_SHORT("too-short"),
		EMPTY("empty");

		private final String errorName;

		private WrongOutcome(String errorName) {
			this.errorName = errorName;
		}

		@Override
		public String getOutcome() {
			return errorName;
		}

		@Override
		public String toString() {
			return getOutcome();
		}
	}

	/**
	 * ManagedPropertyとして指定するにはsetterが必須になる。
	 * そのため対象のフィールドをfinalにはできなくなる。
	 * 即ち定数はManagedPropertyにできない。
	 */
	private static final int MIN_LENGTH = 2;

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public static int getMinimumMessageLength() {
		return MIN_LENGTH;
	}

	public Outcome doNavigation() {
		if (message.length() < MIN_LENGTH) {
			return WrongOutcome.TOO_SHORT;
		} else {
			Outcome page = Faces.getRandomElement(NormalOutcome.values());
			return page;
		}
	}

}
