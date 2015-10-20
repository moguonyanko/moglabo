package exercise.lang;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;

/**
 * 参考：
 * 「Java tutorial」 Default Methods
 */
public interface ZonedTimeMachine extends TimeMachine<ZonedDateTime, ZonedTimeMachine> {
	
	/**
	 * staticメソッドでスーパーインターフェースのメソッド名と
	 * 競合することは許されない。
	 */
//	static LocalDateTime now(){
//	}
	
	default ZoneId getZonedId(){
		return ZoneId.systemDefault();
	}
	
	/**
	 * スーパーインターフェースのデフォルトメソッドを
	 * サブインターフェースのデフォルトメソッドでオーバーライドできる。
	 */
	@Override
	default ZonedDateTime now(){
		return ZonedDateTime.ofInstant(Instant.from(getTime()), getZonedId());
	}

	@Override
	default int compareTo(ZonedTimeMachine another){
		return now().compareTo(another.now());
	}
	
}
