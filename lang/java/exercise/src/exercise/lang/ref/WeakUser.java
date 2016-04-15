package exercise.lang.ref;

import java.util.Objects;

public class WeakUser {

    private final String name;

    public WeakUser(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof WeakUser) {
            WeakUser other = (WeakUser) obj;
            return this.name.equals(other.name);
        } else {
            return false;
        }
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }

    @Override
    public String toString() {
        return name;
    }

}
