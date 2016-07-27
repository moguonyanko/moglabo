package practicejsf.util;

import java.io.Closeable;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.faces.application.Application;
import javax.faces.application.FacesMessage;
import javax.faces.context.FacesContext;
import javax.faces.context.Flash;

public final class Faces {
	
	private static final String REDIRECT_PARAM = "faces-redirect";

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

	public static <T, C extends Collection<T>> boolean isNullOrEmpty(C value) {
		return value == null || value.isEmpty();
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

	public static <K, V> Map<K, V> toMap(K[] keys, V[] values) {
		return toMap(Arrays.asList(keys), Arrays.asList(values));
	}

	private static <T> T getElementFromStream(Stream<T> stream, int index) {
		return stream.collect(Collectors.toList()).get(index);
	}

	public static <T, C extends Collection<T>> T getRandomElement(C src) {
		int index = new Random().nextInt(src.size());

		return getElementFromStream(src.stream(), index);
	}

	public static <T> T getRandomElement(T[] src) {
		int index = new Random().nextInt(src.length);

		return getElementFromStream(Stream.of(src), index);
	}

	public static FacesMessage createErrorMessage(String content) {
		FacesMessage fm = new FacesMessage(content);
		fm.setSeverity(FacesMessage.SEVERITY_ERROR);
		
		return fm;
	}
	
	public static FacesMessage createErrorMessage(Throwable t) {
		return createErrorMessage(t.getMessage());
	}
	
	public static LocalDateTime getLocalDateTimeByDate(Date date) {
		return LocalDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault());
	}
	
	public static Date getDateByLocalDateTime(LocalDateTime localDateTime){
		return new Date(localDateTime.toInstant(ZoneOffset.UTC).toEpochMilli());
	}
	
	public static Date getNextDate(Date date){
		LocalDateTime localDateTime = getLocalDateTimeByDate(date);
		LocalDateTime nextDateTime = localDateTime.plusDays(1);
		return getDateByLocalDateTime(nextDateTime);
	}
	
	public static Flash getFlash(){
		return FacesContext.getCurrentInstance().getExternalContext().getFlash();
	}
	
	public static String redirect(String page){
		return page + "?" + REDIRECT_PARAM + "=true";
	}
	
	public static <V> V getValueFromFlash(String key) {
		Flash flash = getFlash();
		return (V)flash.get(key);
	}
	
	public static void addMessage(String content){
		FacesMessage message = new FacesMessage(content);
		FacesContext.getCurrentInstance().addMessage(null, message);
	}
	
}
