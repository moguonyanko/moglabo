package exercise.lang.ref;

import java.util.Map;
import java.util.WeakHashMap;

/**
 * 参考: http://www.ibm.com/developerworks/library/j-jtp11225/
 */
public class WeakUserManager {

    private final Map<WeakKey, WeakUser> registry = new WeakHashMap<>();

    public void setUser(WeakKey key, WeakUser user) {
        registry.put(key, user);
    }

    public WeakUser getUser(WeakKey key) {
        return registry.get(key);
    }

    public WeakUser removeUser(WeakKey key) {
        return registry.remove(key);
    }

    public boolean has(WeakKey key) {
        return registry.containsKey(key);
    }

}
