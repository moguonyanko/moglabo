package exercise.util.json;

import java.time.LocalDate;
import java.util.Objects;

import javax.json.bind.annotation.JsonbDateFormat;
import javax.json.bind.annotation.JsonbNillable;
import javax.json.bind.annotation.JsonbTransient;

@JsonbNillable
public class RichUser {

    private Ship ship;

    private Card card = new Card("ABC-DEF-123-456");

    @JsonbDateFormat(value = "yyyy/MM/dd")
    private LocalDate birth;

    // JsonbTransientアノテーションを指定するとgetterが定義されていても
    // JSONに含められない。
    @JsonbTransient
    private final String code;

    private String name;

    public RichUser(String code) {
        this(code, null, null, null);
    }

    public RichUser(String code, String name, LocalDate birth, Ship ship) {
        this.code = code;
        this.name = name;
        this.ship = ship;
        this.birth = birth;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public LocalDate getBirth() {
        return birth;
    }

    public Ship getShip() {
        return ship;
    }

    public Card getCard() {
        return card;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj instanceof RichUser) {
            var that = (RichUser)obj;
            return code.equals(that.code);
        }
        return false;
    }

    @Override
    public int hashCode() {
        return Objects.hash(code);
    }
}
