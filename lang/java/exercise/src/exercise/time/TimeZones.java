package exercise.time;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

public class TimeZones {

	public static ZonedDateTime now(ZoneId toZoneId){
		LocalDateTime localDateTime = LocalDateTime.now();
		return ZonedDateTime.of(localDateTime, toZoneId);
	} 
	
	public static OffsetDateTime getOffsetDateTime(ZoneId fromZoneId, 
		ZoneId toZoneId){
		LocalDateTime fromLocalDateTime = LocalDateTime.now(fromZoneId);
		LocalDateTime toLocalDateTime = LocalDateTime.now(toZoneId);
		/**
		 * ZonedDateTime.atZone(ZoneId)はLocalDateTimeにZoneIdを
		 * 付け足すだけである。
		 * Periodは時間を考慮しない。時間を考慮した期間を得たければDurationを使う。
		 */
		ZonedDateTime zonedDateTime = ZonedDateTime.of(fromLocalDateTime, fromZoneId)
			.withZoneSameInstant(toZoneId);
		return OffsetDateTime.of(toLocalDateTime, zonedDateTime.getOffset());
	}
	
}
