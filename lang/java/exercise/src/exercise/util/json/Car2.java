package exercise.util.json;

import javax.json.bind.annotation.JsonbProperty;
import java.util.Objects;

public class Car2 {
    @JsonbProperty(value = "carName")
    private final String name;

    @JsonbProperty(value = "carOwner", nillable = true)
    private String driverName;

    public Car2() {
        this("Unknown");
    }

    public Car2(String name) {
        this(name, null);
    }

    public Car2(String name, String driverName) {
        this.name = name;
        this.driverName = driverName;
    }

    public String getName() {
        return name;
    }

    public String getDriverName() {
        return driverName;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj instanceof Car2) {
            var that = (Car2) obj;
            return name.equals(that.name);
        }
        return false;
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }
}
