package exercise.util.json;

import java.util.Objects;

public class Car {
    private final String carName;

    private String driverName;

    public Car() {
        this("Unknown");
    }

    public Car(String carName) {
        this(carName, null);
    }

    public Car(String carName, String driverName) {
        this.carName = carName;
        this.driverName = driverName;
    }

    public String getCarName() {
        return carName;
    }

    public String getDriverName() {
        return driverName;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj instanceof Car) {
            var that = (Car) obj;
            return carName.equals(that.carName);
        }
        return false;
    }

    @Override
    public int hashCode() {
        return Objects.hash(carName);
    }
}
