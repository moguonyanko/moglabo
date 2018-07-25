package exercise.util.json;

import java.time.Duration;
import java.time.LocalDateTime;

import javax.json.bind.annotation.JsonbDateFormat;
import javax.json.bind.annotation.JsonbProperty;

public class TimeRecord {

    @JsonbProperty("recordTime")
    @JsonbDateFormat("yyyy-MM-dd hh:mm")
    private final LocalDateTime localDateTime =
        LocalDateTime.of(2018, 7, 25, 17, 20);

    private final Duration duration =
        Duration.ofHours(10).plusMinutes(30).plusSeconds(59);

    public LocalDateTime getLocalDateTime() {
        return localDateTime;
    }

    // JsonbPropertyはフィールドとgetterのどちらに指定してもよい。
    @JsonbProperty("recordDuration")
    public Duration getDuration() {
        return duration;
    }
}
