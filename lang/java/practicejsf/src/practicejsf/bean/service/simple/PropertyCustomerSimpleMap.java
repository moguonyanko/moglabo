package practicejsf.bean.service.simple;

import javax.faces.bean.ApplicationScoped;
import javax.faces.bean.ManagedBean;

/**
 * ApplicationScopedが指定されている，即ちこのクラスのオブジェクトは
 * アプリケーション全体で共有するので，eager=trueを指定してサーバ起動時に
 * 初期化するようにしている。
 */
@ManagedBean(name = "currentLookupService", eager = true)
@ApplicationScoped
public class PropertyCustomerSimpleMap extends CustomerSimpleMap {
	
}
