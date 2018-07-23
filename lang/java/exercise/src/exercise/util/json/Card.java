package exercise.util.json;

import java.util.Objects;

public class Card {

    private final String code;

    public Card(String code) {
        this.code = code;
    }

    public String getCode() {
        return "*****";
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
