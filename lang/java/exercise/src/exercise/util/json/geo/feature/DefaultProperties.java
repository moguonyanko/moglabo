package exercise.util.json.geo.feature;

import java.util.*;
import java.util.stream.Collectors;

import javax.json.bind.annotation.JsonbTransient;

import exercise.util.json.geo.Property;
import exercise.util.json.geo.Properties;

public class DefaultProperties implements Properties {

    private final List<? extends Property> attributes;

    public DefaultProperties(List<? extends Property> attributes) {
        this.attributes = attributes;
    }

    // getXXXのXXXがフィールドとしてが存在していなくても
    // getterがあるだけでJSONへのシリアライズへの対象となる。
    @JsonbTransient
    @Override
    public Iterator<? extends Property> getAttributeIterator() {
        return attributes.iterator();
    }

    @Override
    public List<? extends Property> toList() {
        return attributes.stream().collect(Collectors.toList());
    }

    // getterの有無でJSONシリアライズされるかどうかが決まる。
    // つまり既存のクラスのシリアライズしたいフィールドにgetterが実装されておらず
    // そのクラスの修正を行うことができない場合はJsonbAdapterを使うしかない。
    public List<? extends Property> getProperties() {
        return toList();
    }
}
