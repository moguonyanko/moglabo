package exercise.util.json;

import java.time.LocalDateTime;
import java.util.Objects;
import javax.json.bind.annotation.*;

// JsonbPropertyOrderにはプロパティ名ではなくフィールド名を書くこと。
@JsonbPropertyOrder({"time", "price"})
public class Clock {
    private final LocalDateTime time;

    private final long price;

    @JsonbCreator
    public Clock(@JsonbProperty("clockTime") LocalDateTime time,
                 @JsonbProperty("clockPrice") long price) {
        this.time = time;
        this.price = price;
    }

    @JsonbDateFormat("yyyy/MM/dd HH:ss")
    @JsonbProperty("clockTime")
    public LocalDateTime getTime() {
        return time;
    }

    @JsonbNumberFormat("###,###,###")
    @JsonbProperty("clickPrice")
    public long getPrice() {
        return price;
    }

    @Override
    public String toString() {
        return time + ", ¥" + price;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof Clock) {
            var that = (Clock)obj;
            return time.equals(that.time) &&
                price == that.price;
        }
        return false;
    }

    @Override
    public int hashCode() {
        return Objects.hash(time, price);
    }
}
