package practicejsf.bean;

import java.io.Serializable;

import javax.annotation.PostConstruct;
import javax.enterprise.context.Conversation;
import javax.enterprise.context.ConversationScoped;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.inject.Named;

import practicejsf.util.Faces;

/**
 * ConversationスコープのBeanはセッション内で管理される。従ってコンテキストリロード
 * されてもセッションが残っている限りBeanのプロパティの値は保持される。セッションが
 * 破棄されるとConversationスコープのBeanも失われる。
 */
@Named
@ConversationScoped
public class ConversationBean implements Serializable {

	private static final long serialVersionUID = 9997564129913L;
	
	@Inject
	private Conversation conversation;
	
	private int counter;
	
	/**
	 * リダイレクトと一緒に用いなければcidを正常に管理できず
	 * プロパティが更新されなかったりページ遷移の際に例外が発生したりする。
	 */
	private static final boolean USE_REDIRECT = true;
	
	/**
	 * フィールドがシリアライズ可能でないとコンテキストリロードの際に
	 * NotSerializableExceptionが発生する。
	 * staticやtransientなフィールドであれば明示的にシリアライズ不可能なので
	 * 例外は発生しない。
	 * 
	 * ConversationScopedでもセッションスコープの内部で管理されている以上
	 * セッションスコープを使う際の決まり事を守る必要があるということである。
	 */
	private static final Color BEAN_COLOR = new Color("red", "#ff0000");

	/**
	 * この例に関しては@PostConstructではなくコンストラクタを利用して初期化しても
	 * 正常に動作する。
	 */
//	public ConversationBean() {
//		counter = 0;
//	}
	
	/**
	 * リダイレクトされないとページの生成時に呼び出されない。
	 */
	@PostConstruct
	public void init() {
		counter = 0;
	}

	/**
	 * リダイレクトされないとpreRenderViewイベントが発生しないのか，
	 * このメソッドが呼び出されずConversationが開始されない。結果として
	 * 遷移先のURL組立中に例外が発生してページ遷移に失敗する。
	 */
	public void beginConversation() {
		if(!FacesContext.getCurrentInstance().isPostback() && 
			conversation.isTransient()){
			conversation.begin();
		}
	}
	
	public void increment() {
		counter++;
	}
	
	public String confirm() {
		String pageName = "confirm";
		
		if(USE_REDIRECT){
			return Faces.redirect(pageName);
		}else{
			return pageName;
		}
	}
	
	public String endConversation() {
		if(!conversation.isTransient()){
			conversation.end();
		}
		
		String pageName = "counter";
		
		if(USE_REDIRECT){
			return Faces.redirect(pageName);
		}else{
			return pageName;
		}
	}

	public int getCounter() {
		return counter;
	}

	public void setCounter(int counter) {
		this.counter = counter;
	}

	public Conversation getConversation() {
		return conversation;
	}

	public String getColorValue() {
		return BEAN_COLOR.getColorValue();
	}
	
}
