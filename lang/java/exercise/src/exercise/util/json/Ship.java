package exercise.util.json;

import java.util.Objects;

import javax.json.bind.annotation.JsonbProperty;

public class Ship {

    private final String id;

    @JsonbProperty("shipName")
    private final String name;

    public Ship() {
        this("DEFAULT", "NO NAME");
    }

    public Ship(String id, String name) {
        this.id = id;
        this.name = name;
    }

    // デシリアライズ(fromJson)しないならgetterのみでもよい。

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj instanceof Ship) {
            var other = (Ship)obj;
            return id.equals(other.id);
        }
        return false;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
