package exercise.lang.ref;

import java.util.Collections;
import java.util.Map;
import java.util.Objects;
import java.util.WeakHashMap;

/**
 * 参考:
 * http://www.ibm.com/developerworks/library/j-jtp11225/
 */
public class WeakUserManager {

    public static class Key {

        private final String id;

        public Key(String id) {
            this.id = id;
        }

        @Override
        public boolean equals(Object obj) {
            if (obj instanceof Key) {
                Key other = (Key) obj;
                return this.id.equals(other.id);
            } else {
                return false;
            }
        }

        @Override
        public int hashCode() {
            return Objects.hash(id);
        }
    }

    public static class User {

        private final String name;

        public User(String name) {
            this.name = name;
        }

        @Override
        public boolean equals(Object obj) {
            if (obj instanceof User) {
                User other = (User) obj;
                return this.name.equals(other.name);
            } else {
                return false;
            }
        }

        @Override
        public int hashCode() {
            return Objects.hash(name);
        }
    }

    private final Map<Key, User> registry = 
            Collections.<Key, User>synchronizedMap(new WeakHashMap<>());

    public void setUser(Key key, User user){
        registry.put(key, user);
    }
    
    public User getUser(Key key){
        return registry.get(key);
    }
    
    public User removeUser(Key key){
        return registry.remove(key);
    }
    
}
