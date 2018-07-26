package exercise.util.json;

import javax.json.bind.annotation.JsonbProperty;

/**
 * 参考:
 * https://www.ibm.com/developerworks/library/j-javaee8-json-binding-3/index.html
 */
public class SampleUser {
    @JsonbProperty("userName")
    private String name;

    private int age;

    private String comment;

    private final double dummyCode = Double.NaN;

    public SampleUser() {
        this("No Name", -1, "No Comment");
    }

    public SampleUser(String name, int age, String comment) {
        this.name = name;
        this.age = age;
        this.comment = comment;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // ageフィールドはtoJsonではuserAgeというプロパティ名でシリアライズされるが、
    // fromJsonの引数のJSONではageというプロパティ名でなければでシリアライズで
    // 使用されない。
    @JsonbProperty("userAge")
    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getComment() {
        return comment;
    }

    @JsonbProperty("userComment")
    public void setComment(String comment) {
        this.comment = comment;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof SampleUser) {
            var that = (SampleUser)obj;
            return name.equals(that.name) &&
                age == that.age &&
                // floatやdoubleは-0.0fやNaNなどの特殊な値を持っているため
                // compareメソッドで検査を行う。(Effective Java 第2版 項目8)
                Double.compare(dummyCode, that.dummyCode) == 0;
        }
        return false;
    }
}
