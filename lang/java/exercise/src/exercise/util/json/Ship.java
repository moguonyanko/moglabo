package exercise.util.json;

import java.util.Objects;

import javax.json.bind.annotation.JsonbCreator;
import javax.json.bind.annotation.JsonbProperty;

public class Ship {

    private final String id;

    @JsonbProperty("shipName")
    private final String name;

    // 引数無しコンストラクタが存在しなくてもJsonbCreatorが指定されたコンストラクタが
    // 定義されていればそちらを使ってJSONからのデシリアライズが行われる。このとき
    // コンストラクタにJsonbPropertyで指定したプロパティ名がJSONに存在しなければ
    // JsonbExceptionがスローされる。
    @JsonbCreator
    public Ship(@JsonbProperty("shipId") String id,
                @JsonbProperty("shipName") String name) {
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

    @Override
    public String toString() {
        return "id=" + id + ",name=" + name;
    }
}
