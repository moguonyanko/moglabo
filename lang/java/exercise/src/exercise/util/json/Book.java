package exercise.util.json;

import java.io.InvalidObjectException;
import java.io.Serializable;
import java.util.Objects;
import javax.json.bind.annotation.JsonbProperty;

/**
 * JSON Binding APIでオブジェクトをシリアライズorデシリアライズするのに
 * 引数なしコンストラクタは必須である。シリアライズプロキシを記述しても無視される。
 */
public class Book implements Serializable {
    // 実行時のプロパティ名変更よりJsonbPropertyの設定が優先される。
    // コンパイル時のプロパティ名変更の方が優先されるということ。
    @JsonbProperty("bookid")
    private final String id;

    private final String name;

    private final String author;

    public Book(String id, String name, String author) {
        this.id = id;
        this.name = name;
        this.author = author;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getAuthor() {
        return author;
    }

    public String getBookKey() {
        return id + "-" + name;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof Book) {
            var other = (Book)obj;
            return id.equals(other.id) &&
                name.equals(other.name) &&
                author.equalsIgnoreCase(other.author);
        }
        return false;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, author);
    }

    private static class SerializationProxy implements Serializable {
        private static final long serialVersionUID = 9326123139L;

        private final String id;
        private final String name;
        private final String author;

        SerializationProxy(Book book) {
            this.id = book.id;
            this.name = book.name;
            this.author = book.author;
        }

        private Object readResolve() {
            return new Book(id, name, author);
        }
    }

    private void readObject() throws InvalidObjectException {
        throw new InvalidObjectException("Must use proxy");
    }

    private Object writeReplace() {
        return new SerializationProxy(this);
    }
}
