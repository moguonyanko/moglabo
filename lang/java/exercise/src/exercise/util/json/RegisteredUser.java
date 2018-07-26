package exercise.util.json;

import javax.json.bind.annotation.JsonbCreator;
import javax.json.bind.annotation.JsonbProperty;
import javax.json.bind.annotation.JsonbTypeDeserializer;
import javax.json.bind.annotation.JsonbTypeSerializer;

// ここにシリアライズ関連のアノテーションを指定しても使われない。
//@JsonbTypeSerializer(RegisteredUserSerializer.class)
//@JsonbTypeDeserializer(RegisteredUserDeserializer.class)
public class RegisteredUser {

    private final long code;

    @JsonbProperty(nillable = true)
    private String name = "";

    private String initialName = "";

    public RegisteredUser(int code, String name) {
        this(code, name, "");
    }

    // フィールド名とパラメータ名が同じでもJsonbPropertyによる名前の指定は必要。
    // JsonbCreatorは1つのクラスに1つだけ指定できる。
    // 2つ以上指定すると実行時例外がスローされる。
    @JsonbCreator
    public RegisteredUser(@JsonbProperty("code") int code,
                          @JsonbProperty("name") String name,
                          @JsonbProperty("initialName") String initialName) {
        this.code = code;
        this.name = name;
        this.initialName = initialName;
    }

    public long getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getInitialName() {
        return initialName;
    }

    @Override
    public String toString() {
        return "code=" + code + ",name=" + name + ",initialName=" + initialName;
    }
}
