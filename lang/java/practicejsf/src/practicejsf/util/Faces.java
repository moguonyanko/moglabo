package practicejsf.util;

import java.io.Closeable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.faces.application.Application;
import javax.faces.context.FacesContext;

public final class Faces {

	public static <T> T getData(String key, Class<T> klass) {
		FacesContext context = FacesContext.getCurrentInstance();
		Map<String, Object> sessionMap = context.getExternalContext().getSessionMap();
		Object o = sessionMap.get(key);

		if (klass.isInstance(o)) {
			return klass.cast(o);
		} else {
			return null;
		}
	}

	public static boolean close(Closeable closeable) {
		if (closeable != null) {
			try {
				closeable.close();
			} catch (Exception exception) {
				System.err.println("クローズ失敗:" + exception.getMessage());
				return false;
			}
		}

		return true;
	}

	public static Application getApplication() {
		return FacesContext.getCurrentInstance().getApplication();
	}

	public static boolean isNullOrEmpty(String value) {
		return value == null || value.trim().isEmpty();
	}

	/**
	 * @todo
	 * ラムダ式とストリームで整理する。
	 */
	public static <K, V> Map<K, V> toMap(List<K> keys, List<V> values) {
		Map<K, V> result = new HashMap<>();

		int keySize = keys.size();
		/**
		 * List.addAllしてもサイズが足りない部分がnullで埋められたりはしない。
		 * List<V> vs = new ArrayList<>(keySize);
		 * //keysのサイズがvaluesのサイズより大きくてもvsのサイズはvaluesと同じ。
		 * //Collections.fillで事前にnullで埋めておいてもサイズは増えない。
		 * vs.addAll(values);
		 */

		for (int i = 0; i < keySize; i++) {
			K key = keys.get(i);

			V value;
			try {
				value = values.get(i);
			} catch (IndexOutOfBoundsException ex) {
				value = null;
			}

			/**
			 * 既存のキーとそれに紐付く値は上書きされる。
			 */
			result.put(key, value);
		}

		return result;
	}

}
