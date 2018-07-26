package exercise.util.json;

import javax.json.bind.annotation.JsonbProperty;
import java.util.Objects;

public class SampleUser2 {

    @JsonbProperty("userName")
    private final String name;

    private static final String groupName = "Group 1";

    private final String secretName;
    private final long secretNo;
    private final float secretData;

    public SampleUser2(String name) {
        this.name = name;
        this.secretName = "SECRET";
        this.secretNo = 100L;
        this.secretData = -0.0f;
    }

    public String getName() {
        return name;
    }

    public String getSecretName() {
        return secretName;
    }

    public long getSecretNo() {
        return secretNo;
    }

    public float getSecretData() {
        return secretData;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof SampleUser2) {
            var that = (SampleUser2)obj;
            return name.equals(that.name) &&
                secretName.equals(that.secretName) &&
                secretNo == that.secretNo &&
                Float.compare(secretData, that.secretData) == 0;
        }
        return false;
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, secretName, secretNo, secretData);
    }
}
