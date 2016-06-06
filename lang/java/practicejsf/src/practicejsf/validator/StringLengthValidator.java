package practicejsf.validator;

import java.text.MessageFormat;

import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.validator.FacesValidator;
import javax.faces.validator.Validator;
import javax.faces.validator.ValidatorException;

@FacesValidator(value = "stringLengthValidator")
public class StringLengthValidator implements Validator {

	@Override
	public void validate(FacesContext context, UIComponent component, Object o) 
		throws ValidatorException {
		
		String inputString = o.toString();
		int len = inputString.length();
		
		/**
		 * ハードコーディングしない場合，バリデータの境界値は引数無しコンストラクタの中で
		 * 設定ファイルの値を代入するしかないのかもしれない。
		 * UIComponentの属性を得ることはできるが，<f:validator>に境界値のための
		 * 独自の属性を指定することができないので意味が無い。
		 */
		int min = 1, max = 10;
		
		if(len <= min || max <= len){
			String msg = MessageFormat.format(min + "文字から" + max + "文字の入力が可能です。", inputString);
			FacesMessage facesMessage = new FacesMessage(FacesMessage.SEVERITY_ERROR, msg, msg);
			throw new ValidatorException(facesMessage);
		}
	}
	
}
