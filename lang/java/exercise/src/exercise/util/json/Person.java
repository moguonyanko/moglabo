package exercise.util.json;

import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.Objects;

import javax.json.bind.annotation.*;
import javax.json.bind.config.PropertyOrderStrategy;

/**
 * 参考:
 * https://www.ibm.com/developerworks/jp/java/library/j-whats-new-in-javaee-8/index.html
 * http://www.baeldung.com/java-json-binding-api
 */
@JsonbPropertyOrder(PropertyOrderStrategy.REVERSE)
public class Person {

    private int id;

    @JsonbProperty("person-name")
    private String name = "";

    @JsonbProperty(nillable = true)
    private String email = "";

    @JsonbTransient
    private int age;

    @JsonbDateFormat("yyyy-MM-dd")
    private LocalDate registeredDate = LocalDate.now();

    @JsonbProperty(nillable = true)
    private BigDecimal salary;

    @JsonbNumberFormat(locale = "ja_JP", value = "#0.0")
    public BigDecimal getSalary() {
        return salary;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof Person) {
            var other = (Person)obj;
            return id == other.id &&
                name.equals(other.name) &&
                email.equalsIgnoreCase(other.email) &&
                age == other.age &&
                registeredDate.equals(other.registeredDate);
        }
        return false;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, email, age, registeredDate);
    }
}
