package exercise.util.json;

import java.util.Objects;

import javax.json.bind.annotation.JsonbProperty;
import javax.json.bind.annotation.JsonbTransient;

public class Student {

    private int id;

    @JsonbProperty(value = "student-name", nillable = true)
    private String name;

    @JsonbTransient
    private int age;

//    // JSON-Bで引数なしコンストラクタは必須
    public Student() {
        this(-1, "anonymous", -1);
    }
//
    public Student(int id, String name, int age) {
        this.id = id;
        // TODO:
        // オブジェクト型のフィールドに値を代入するとJSONの生成に失敗する。
        // アクセッサメソッド経由での代入もダメ。
//        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof Student) {
            var other = (Student)obj;
            return id == other.id;
        }
        return false;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
