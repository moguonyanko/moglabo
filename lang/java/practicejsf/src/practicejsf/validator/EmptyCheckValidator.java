package practicejsf.validator;

import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.validator.FacesValidator;
import javax.faces.validator.Validator;
import javax.faces.validator.ValidatorException;

import practicejsf.util.Faces;

/**
 * より汎用性の高いバリデータはValidatorインターフェースを実装したクラスとして定義する。
 * Beanと密接に関連付いた再利用性の低いバリデーションはBeanのメソッドで行う。
 */
@FacesValidator(value = "emptyCheckValidator")
public class EmptyCheckValidator implements Validator {

	@Override
	public void validate(FacesContext fc, UIComponent uic, Object o) throws ValidatorException {
		if (Faces.isNullOrEmpty(o.toString())) {
			throw new ValidatorException(Faces.createErrorMessage("値が未入力です"));
		}
	}

}
