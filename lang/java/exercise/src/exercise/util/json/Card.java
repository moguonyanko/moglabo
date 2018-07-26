package exercise.util.json;

import java.util.Objects;
import javax.json.bind.annotation.JsonbTypeAdapter;

public class Card {

    // Adapterを指定していてもgetterは必要。getterが定義されていないと
    // JSONシリアライズの対象外となる。
    @JsonbTypeAdapter(CardCordAdapter.class)
    private final String code;

    public Card(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj instanceof Card) {
            var that = (Card)obj;
            return code.equals(that.code);
        }
        return false;
    }

    @Override
    public int hashCode() {
        return Objects.hash(code);
    }
}
