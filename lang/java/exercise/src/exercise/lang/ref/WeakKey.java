package exercise.lang.ref;

import java.util.Objects;

public class WeakKey {

    private final String id;

    public WeakKey(String id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof WeakKey) {
            WeakKey other = (WeakKey) obj;
            return this.id.equals(other.id);
        } else {
            return false;
        }
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "[" + id + "]";
    }
    
}
