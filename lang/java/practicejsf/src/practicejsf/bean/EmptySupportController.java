package practicejsf.bean;

import practicejsf.util.Faces;

public class EmptySupportController extends SimpleController {

	/**
	 * emptyPageはManagedPropertyではないのでsetterは必須ではない。
	 * 読み取りしか行われないならgetterだけ定義するのでも良い。その場合でも
	 * <managed-bean-name>.emptyPageでアクセスして値を得られる。
	 */
	private final String emptyPage = "error-message-empty.xhtml";
	
	@Override
	public Outcome doNavigation() {
		if (Faces.isNullOrEmpty(getMessage())) {
			return WrongOutcome.EMPTY;
		}
		
		return super.doNavigation();
	}

	public String getEmptyPage() {
		return emptyPage;
	}
	
}
