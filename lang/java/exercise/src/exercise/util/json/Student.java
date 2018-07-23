package exercise.util.json;

import java.util.Objects;

/**
 * 参考:
 * https://www.ibm.com/developerworks/library/j-javaee8-json-binding-1/index.html
 * http://json-b.net/users-guide.html
 */
public class Student {

    private int id;

    private String name;

    private int age;

    // fromJsonによるデシリアライズにて引数無しコンストラクタは必須である。
    public Student() {
        this(-1, "anonymous", -1);
    }

    public Student(int id, String name, int age) {
        this.id = id;
        this.name = name;
        this.age = age;
    }

    // getterが定義されているフィールドだけがtoJsonによる
    // シリアライズ(JavaオブジェクトからJSONへの変換)の対象となる。

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    // setterが定義されているフィールドだけがfromJsonによる
    // デシリアライズ(JSONからJavaオブジェクトへの変換)の対象となる。

    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public String toString() {
        StringBuilder s = new StringBuilder();
        s.append("id = ").append(id);
        s.append(",name = ").append(name);
        s.append(",age = ").append(age);
        return s.toString();
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof Student) {
            var other = (Student)obj;
            return id == other.id &&
                name.equals(other.name) &&
                age == other.age;
        }
        return false;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, age);
    }
}
