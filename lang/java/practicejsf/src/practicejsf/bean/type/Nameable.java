package practicejsf.bean.type;

/**
 * Beanが持っているべきプロパティを定義するインターフェース
 */
public interface Nameable {
	
	String getFirstName();
	
	void setFirstName(String name);
	
	String getLastName();
	
	void setLastName(String name);
	
}
