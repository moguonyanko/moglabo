package exercise.util.json.geo.feature;

import java.util.*;

import exercise.util.json.geo.Attribute;
import exercise.util.json.geo.Properties;

import javax.json.bind.annotation.JsonbTransient;
import javax.json.bind.annotation.JsonbVisibility;

public class DefaultProperties implements Properties {

    private final List<? extends Attribute> attributes;

    public DefaultProperties(List<? extends Attribute> attributes) {
        this.attributes = attributes;
    }

    /**
     * getXXXのXXXがフィールドとしてが存在していなくても
     * getterがあるだけでJSONへのシリアライズへの対象となる。
     */
    @JsonbTransient
    @Override
    public Iterator<? extends Attribute> getAttributeIterator() {
        return attributes.iterator();
    }

    @Override
    public List<? extends Attribute> getAttributes() {
        return new ArrayList<>(attributes);
    }
}
